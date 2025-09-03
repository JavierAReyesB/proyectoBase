// JobTablePanel.tsx
'use client'

import React, { useContext, useEffect, useRef, useState } from 'react'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'
import { fetchTrabajos, type Trabajo } from './services/api'
import { jobTableColumns } from './columns'
import { useDrawerContext } from '@/components/drawer/DrawerProvider'
import { TrabajoDrawer } from './drawer/TrabajosDrawer'
import { useFiltroTabla } from './hooks/useFiltroTabla'
import { useFiltrosJobs } from './FiltrosJobsContext'
import { TableContext } from '@/components/TableContext' // ref global

export const JobTablePanel: React.FC = () => {
  const [rowData, setRowData] = useState<Trabajo[]>([])

  // filtros externos
  const { selectedSede, selectedTipo, searchTerm, showRecords } = useFiltrosJobs()

  // drawer context (añado closeDrawer)
  const { openDrawers, openDrawer, updateDrawer, closeDrawer } = useDrawerContext() as any

  // ref global a la tabla (compartida con DrawerOverlay)
  const tableRef = useContext(TableContext)! // <- MISMA ref

  // trackea el "main" reutilizable
  const primaryDrawerIdRef = useRef<string | null>(null)

  // cargar data
  useEffect(() => {
    fetchTrabajos().then(setRowData)
  }, [])

  // aplicar filtros
  const filteredData = useFiltroTabla<Trabajo>({
    data: rowData,
    selectedSede,
    selectedTipo,
    searchTerm,
    sedeKey: 'sede',
    tipoKey: 'servicio',
    searchKeys: ['id'] as (keyof Trabajo)[],
  })

  /** Maneja el clic en una fila
   * - Mantiene tu UX de "single main" (reutiliza el panel activo si procede)
   * - IDs ÚNICOS para que varios minimizados convivan y se restauren sin cerrar otros (como Avisos)
   * - Si ya existe un drawer de ese trabajo (minimizado/abierto), lo trae al frente en vez de duplicarlo
   */
  const handleRowClick = (trabajo: Trabajo) => {
    const uniqueId = `trabajo-${trabajo.id}`     // id único por item (como Avisos)
    const instanceId = `Trabajo-${trabajo.id}`

    const primaryId = primaryDrawerIdRef.current
    const primary = primaryId ? openDrawers.find((d: any) => d.id === primaryId) : null

    const drawerData = {
      instanceId,
      contentKey: 'trabajo',
      contentData: { trabajo },
      content: <TrabajoDrawer key={trabajo.id} data={trabajo} />, 
      hideBackdrop: true,
    }

    // 1) Reutiliza MAIN si está abierto, no pineado y no full
    if (primary && primary.width !== 'full' && !primary.isPinned) {
      updateDrawer(primary.id, drawerData)
      return
    }

    // 2) Si ya existe este trabajo (abierto/minimizado), restáuralo/actualízalo
    const existing = openDrawers.find(
      (d: any) => d.id === uniqueId || d.instanceId === instanceId
    )
    if (existing) {
      updateDrawer(existing.id, drawerData)
      if (!primary || primary.width === 'full' || primary.isPinned) {
        primaryDrawerIdRef.current = existing.id
      }
      return
    }

    // 3) Abre uno nuevo con ID único
    openDrawer({
      id: uniqueId,
      title: 'Detalle del Trabajo',
      width: 'half',
      isPinned: false,
      icon: null,
      ...drawerData,
    })

    if (!primary || primary.width === 'full' || primary.isPinned) {
      primaryDrawerIdRef.current = uniqueId
    }
  }

  /**
   * Click-away: cierra el top drawer cuando el click ocurre
   * - FUERA de la tabla
   * - y FUERA de cualquier drawer o barra de minimizados
   * Mantiene la capacidad de clicar filas para actualizar (no se cierra).
   */
  // Click-away seguro: cierra solo si haces click FUERA de la tabla, FUERA del drawer y FUERA de sus controles
  useEffect(() => {
    const onGlobalPointerDown = (e: PointerEvent) => {
      if (!openDrawers?.length) return
      if (e.button !== 0) return // solo click izquierdo

      const target = e.target as HTMLElement
      const tableEl = (tableRef as React.MutableRefObject<HTMLDivElement | null>)?.current

      // ----- helpers de zonas permitidas -----
      const isInsideDrawer = (el: HTMLElement) =>
        !!el.closest(
          [
            // raíces/comunes
            '[role="dialog"]',
            '[data-drawer-root]',
            '[data-drawer]',
            '[data-drawer-content]',
            '.drawer',
            '.drawer-content',
            '.drawer-overlay',
            // cabecera/portal/controles posibles
            '[data-drawer-header]',
            '[data-drawer-controls]',
            '[data-portal]',
            '[data-drawer-portal]',
            // fallback amplio por clase/id
            '[class*="drawer"]',
            '[id*="drawer"]',
          ].join(',')
        )

      const isDrawerControlClick = (el: HTMLElement) =>
        !!el.closest(
          [
            // acciones típicas
            '[data-drawer-action]',
            '[data-drawer-minimize]',
            '[data-drawer-pin]',
            '[data-drawer-close]',
            '[data-drawer-toggle]',
            // fallback por clases comunes
            '.drawer-minimize',
            '.drawer-pin',
            '.drawer-close',
            '.drawer-toggle',
            // cualquier botón dentro de un contenedor del drawer
            'button,[role="button"]',
          ].join(',')
        ) && isInsideDrawer(el)

      const isInMinimizedBar = (el: HTMLElement) =>
        !!el.closest('[data-minimized-drawers],[data-minimized-drawers-bar],[class*="minimiz"]')

      // ----- reglas de salida: NO cerrar -----
      // 1) clic dentro del drawer
      if (isInsideDrawer(target)) return
      // 2) clic en controles del drawer (minimizar/pinear/cerrar)
      if (isDrawerControlClick(target)) return
      // 3) clic en la barra de minimizados
      if (isInMinimizedBar(target)) return
      // 4) clic dentro de la tabla (permitimos actualizar el drawer)
      if (tableEl && tableEl.contains(target)) return

      // ----- cerrar el top si no está pineado -----
      const top = openDrawers[openDrawers.length - 1]
      if (top && !top.isPinned) {
        closeDrawer?.(top.id)
      }
    }

    document.addEventListener('pointerdown', onGlobalPointerDown, true) // capture
    return () => document.removeEventListener('pointerdown', onGlobalPointerDown, true)
  }, [openDrawers, tableRef, closeDrawer])


  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 py-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-x-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-light text-slate-800 tracking-wide">
          Panel de Gestión
        </h1>
        <p className="text-slate-600 font-light text-sm sm:text-base">
          Sistema de seguimiento y control de servicios
        </p>
      </div>

      {/* Tabla */}
      <div
        ref={tableRef}
        className="relative z-[7000] mix-blend-lighten bg-white rounded-md shadow-md p-4 space-y-6"
      >
        <ResponsiveTable
          columnDefs={jobTableColumns}
          rowData={filteredData}
          pagination
          paginationPageSize={parseInt(showRecords)}
          breakpoint={1024}
          onRowClick={handleRowClick}

        />

        <div className="text-sm text-gray-600 mt-4">
          Mostrando {filteredData.length} de {rowData.length} registros
        </div>
      </div>
    </div>
  )
}
