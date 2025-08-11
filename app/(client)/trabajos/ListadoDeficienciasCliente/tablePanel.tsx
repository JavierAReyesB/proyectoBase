// DeficienciaTablePanel.tsx
'use client'

import React, { useContext, useEffect, useRef, useState } from 'react'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'
import { fetchDeficiencias, type Deficiencia } from './services/api'
import { jobTableColumns } from './columns'
import { useDrawerContext } from '@/components/drawer/DrawerProvider'
import { DeficienciaDrawer } from './drawer/DeficienciaDrawer'
import { useFiltroTabla } from './hooks/useFiltroTabla'
import { useFiltrosDeficiencias } from './FiltrosDeficienciasContext'
import { TableContext } from '@/components/TableContext'

export const DeficienciaTablePanel: React.FC = () => {
  const [rowData, setRowData] = useState<Deficiencia[]>([])

  // filtros externos
  const {
    selectedSede,
    selectedTipo,
    selectedCategoria,
    searchTerm,
    showRecords,
  } = useFiltrosDeficiencias()

  // drawer context (incluye closeDrawer)
  const { openDrawers, openDrawer, updateDrawer, closeDrawer } = useDrawerContext() as any

  // ref global a la tabla (compartida con DrawerOverlay)
  const tableRef = useContext(TableContext)! // MISMA ref que en JobTablePanel

  // trackea el "main" reutilizable
  const primaryDrawerIdRef = useRef<string | null>(null)

  // cargar data
  useEffect(() => {
    fetchDeficiencias().then(setRowData)
  }, [])

  // aplicar filtros
  const filteredData = useFiltroTabla<Deficiencia>({
    data: rowData,
    selectedSede,
    selectedTipo,
    selectedCategoria,
    searchTerm,
    sedeKey: 'sede',
    tipoKey: 'servicio',
    categoriaKey: 'tipoTrabajo',
    searchKeys: ['id'] as (keyof Deficiencia)[],
  })

  /** Maneja el clic en una fila
   * - Mantiene UX de "single main" (reutiliza el panel activo si procede)
   * - IDs ÚNICOS por deficiencia para poder minimizar/restaurar sin cerrar otros
   * - Si ya existe un drawer de esa deficiencia, lo trae al frente/actualiza
   */
  const handleRowClick = (def: Deficiencia) => {
    const uniqueId   = `deficiencia-${def.id}`      // id único por item
    const instanceId = `Deficiencia-${def.id}`

    const primaryId = primaryDrawerIdRef.current
    const primary   = primaryId ? openDrawers.find((d: any) => d.id === primaryId) : null

    const drawerData = {
      instanceId,
      contentKey:  'deficiencia',
      contentData: { def },
      content:     <DeficienciaDrawer data={def} />,
      hideBackdrop: true, // permitir clicar tabla para actualizar el main
    }

    // 1) Reutiliza MAIN si está abierto, no pineado y no full
    if (primary && primary.width !== 'full' && !primary.isPinned) {
      updateDrawer(primary.id, drawerData)
      return
    }

    // 2) Si ya existe esta deficiencia (abierta/minimizada), restáurala/actualízala
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
      id:       uniqueId,
      title:    'Detalle de Deficiencia',
      width:    'half',
      isPinned: false,
      icon:     null,
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
          Panel de Deficiencias
        </h1>
        <p className="text-slate-600 font-light text-sm sm:text-base">
          Listado y control de deficiencias detectadas
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
          mobileCardProps={{
            titleField: 'sede',
            collapsedFields: ['estado', 'tipoTrabajo'],
            hiddenFields: [],
            expandedFieldOrder: [
              'fecha',
              'sede',
              'tipoTrabajo',
              'servicio',
              'operario',
              'recomendaciones',
              'criticidad',
              'resultado',
              'estado',
            ],
          }}
        />

        <div className="text-sm text-gray-600 mt-4">
          Mostrando {filteredData.length} de {rowData.length} registros
        </div>
      </div>
    </div>
  )
}
