'use client'

import React, { useContext, useEffect, useRef, useState } from 'react'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'
import { fetchAvisos, type Aviso } from './services/api'
import { avisoTableColumns } from './columns'
import { useDrawerContext } from '@/components/drawer/DrawerProvider'
import { AvisosDrawer } from './drawer/AvisosDrawer'
import { useFiltroTablaAvisos } from './hooks/useFiltroTablaAvisos'
import { TableContext } from '@/components/TableContext'

// ✅ lee filtros del contexto que actualiza el AppSidebar
import { useFiltrosAvisos } from './FiltrosAvisosContext'

export const TablePanel: React.FC = () => {
  const [rowData, setRowData] = useState<Aviso[]>([])

  // Filtros controlados por el AppSidebar (vía FiltersPanelProvider + Wrapper)
  const {
    selectedSede,
    selectedTipo,
    searchTerm,
    showRecords,
    estado,
    prioridad,
    desde,
    hasta,
  } = useFiltrosAvisos()

  // Drawer API (reutiliza, actualiza, cierra)
  const { openDrawers, openDrawer, updateDrawer, closeDrawer } = useDrawerContext() as any

  // Ref global a la tabla (mismo patrón que en Jobs)
  const tableRef = useContext(TableContext)!
  const primaryDrawerIdRef = useRef<string | null>(null)

  // Carga de datos
  useEffect(() => {
    fetchAvisos().then(setRowData)
  }, [])

  // Filtrado en memoria usando los filtros del contexto
  const filteredData = useFiltroTablaAvisos<Aviso>({
    data: rowData,
    selectedSede,
    selectedTipo,
    searchTerm,
    estado,
    prioridad,
    desde,
    hasta,
    sedeKey: 'sede',                         // ajusta si tu modelo difiere
    tipoKey: 'tipoAviso' as keyof Aviso,     // o 'servicio' / 'tipo' si corresponde
    dateKey: 'fecha' as keyof Aviso,         // o 'createdAt' / 'fechaCreacion'
    searchKeys: ['id', 'descripcion', 'cliente'] as (keyof Aviso)[],
  })

  // Click en fila → drawer (reutiliza "main", restaura si ya existe, IDs únicos)
  const handleRowClick = (aviso: Aviso) => {
    const uniqueId = `aviso-${aviso.id}`
    const instanceId = `Aviso-${aviso.id}`

    const primaryId = primaryDrawerIdRef.current
    const primary = primaryId ? openDrawers?.find((d: any) => d.id === primaryId) : null

    const drawerData = {
      instanceId,
      contentKey: 'aviso',
      contentData: { aviso },
      content: <AvisosDrawer key={aviso.id} data={aviso} />,
      hideBackdrop: true,
    }

    if (primary && primary.width !== 'full' && !primary.isPinned) {
      updateDrawer(primary.id, drawerData)
      return
    }

    const existing = openDrawers?.find(
      (d: any) => d.id === uniqueId || d.instanceId === instanceId
    )
    if (existing) {
      updateDrawer(existing.id, drawerData)
      if (!primary || primary.width === 'full' || primary.isPinned) {
        primaryDrawerIdRef.current = existing.id
      }
      return
    }

    openDrawer({
      id: uniqueId,
      title: 'Detalle del Aviso',
      width: 'half',
      isPinned: false,
      icon: null,
      ...drawerData,
    })

    if (!primary || primary.width === 'full' || primary.isPinned) {
      primaryDrawerIdRef.current = uniqueId
    }
  }

  // Click-away seguro (cierra top drawer fuera de tabla/drawers)
  useEffect(() => {
    const onGlobalPointerDown = (e: PointerEvent) => {
      if (!openDrawers?.length) return
      if (e.button !== 0) return // solo click izquierdo

      const target = e.target as HTMLElement
      const tableEl = (tableRef as React.MutableRefObject<HTMLDivElement | null>)?.current

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

      // NO cerrar en estas zonas
      if (isInsideDrawer(target)) return
      if (isDrawerControlClick(target)) return
      if (isInMinimizedBar(target)) return
      if (tableEl && tableEl.contains(target)) return

      // Cerrar el top si no está pineado
      const top = openDrawers[openDrawers.length - 1]
      if (top && !top.isPinned) {
        closeDrawer?.(top.id)
      }
    }

    document.addEventListener('pointerdown', onGlobalPointerDown, true)
    return () => document.removeEventListener('pointerdown', onGlobalPointerDown, true)
  }, [openDrawers, tableRef, closeDrawer])

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 py-6">
      {/* Encabezado (igual que en Jobs) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-x-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-light text-slate-800 tracking-wide">
          Panel de Avisos
        </h1>
        <p className="text-slate-600 font-light text-sm sm:text-base">
          Listado y seguimiento de avisos reportados
        </p>
      </div>

      {/* Contenedor de la tabla */}
      <div
        ref={tableRef}
        className="relative z-[7000] mix-blend-lighten bg-white rounded-md shadow-md p-4 space-y-6"
      >
        <ResponsiveTable
          columnDefs={avisoTableColumns}
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
