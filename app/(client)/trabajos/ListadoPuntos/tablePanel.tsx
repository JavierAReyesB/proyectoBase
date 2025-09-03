'use client'

import React, { useContext, useEffect, useRef, useState } from 'react'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'
import { fetchPuntos, type Punto } from './services/api'
import { puntosTableColumns } from './columns'
import { useDrawerContext } from '@/components/drawer/DrawerProvider'
import { PuntosDrawer } from './drawer/PuntosDrawer'
import { useFilters } from '../../layout/FiltersContext'
import { useFiltroTabla } from './hooks/useFiltroTabla'
import { TableContext } from '@/components/TableContext'

export const TablePanel: React.FC = () => {
  const [rowData, setRowData] = useState<Punto[]>([])

  const { selectedSede, selectedTipo, searchTerm, showRecords } = useFilters()
  const { openDrawers, openDrawer, updateDrawer, closeDrawer } = useDrawerContext() as any
  const tableRef = useContext(TableContext)!
  const primaryDrawerIdRef = useRef<string | null>(null)

  useEffect(() => {
    fetchPuntos().then(setRowData)
  }, [])

  const filteredData = useFiltroTabla<Punto>({
    data: rowData,
    selectedSede,
    selectedTipo,
    searchTerm,
    sedeKey: 'sede',
    // ⬇️ usa la clave REAL del tipo de punto. Cambia 'servicio' si tu modelo usa otra (p.ej. 'tipoTrabajo' o 'categoria').
    tipoKey: 'servicio' as keyof Punto,
    searchKeys: ['id'] as (keyof Punto)[],
  })

  const handleRowClick = (punto: Punto) => {
    const uniqueId = `punto-${punto.id}`
    const instanceId = `Punto-${punto.id}`

    const primaryId = primaryDrawerIdRef.current
    const primary = primaryId ? openDrawers?.find((d: any) => d.id === primaryId) : null

    const drawerData = {
      instanceId,
      contentKey: 'punto',
      contentData: { punto },
      content: <PuntosDrawer key={String(punto.id)} data={punto} />,
      hideBackdrop: true,
    }

    if (primary && primary.width !== 'full' && !primary.isPinned) {
      updateDrawer(primary.id, drawerData)
      return
    }

    const existing = openDrawers?.find((d: any) => d.id === uniqueId || d.instanceId === instanceId)
    if (existing) {
      updateDrawer(existing.id, drawerData)
      if (!primary || primary.width === 'full' || primary.isPinned) {
        primaryDrawerIdRef.current = existing.id
      }
      return
    }

    openDrawer({
      id: uniqueId,
      title: 'Detalle del Punto',
      width: 'half',
      isPinned: false,
      icon: null,
      ...drawerData,
    })

    if (!primary || primary.width === 'full' || primary.isPinned) {
      primaryDrawerIdRef.current = uniqueId
    }
  }

  useEffect(() => {
    const onGlobalPointerDown = (e: PointerEvent) => {
      if (!openDrawers?.length || e.button !== 0) return
      const target = e.target as HTMLElement
      const tableEl = (tableRef as React.MutableRefObject<HTMLDivElement | null>)?.current

      const isInsideDrawer = (el: HTMLElement) =>
        !!el.closest(
          [
            '[role="dialog"]',
            '[data-drawer-root]',
            '[data-drawer]',
            '[data-drawer-content]',
            '.drawer',
            '.drawer-content',
            '.drawer-overlay',
            '[data-drawer-header]',
            '[data-drawer-controls]',
            '[data-portal]',
            '[data-drawer-portal]',
            '[class*="drawer"]',
            '[id*="drawer"]',
          ].join(',')
        )

      const isDrawerControlClick = (el: HTMLElement) =>
        !!el.closest(
          [
            '[data-drawer-action]',
            '[data-drawer-minimize]',
            '[data-drawer-pin]',
            '[data-drawer-close]',
            '[data-drawer-toggle]',
            '.drawer-minimize',
            '.drawer-pin',
            '.drawer-close',
            '.drawer-toggle',
            'button,[role="button"]',
          ].join(',')
        ) && isInsideDrawer(el)

      const isInMinimizedBar = (el: HTMLElement) =>
        !!el.closest('[data-minimized-drawers],[data-minimized-drawers-bar],[class*="minimiz"]')

      if (isInsideDrawer(target)) return
      if (isDrawerControlClick(target)) return
      if (isInMinimizedBar(target)) return
      if (tableEl && tableEl.contains(target)) return

      const top = openDrawers[openDrawers.length - 1]
      if (top && !top.isPinned) closeDrawer?.(top.id)
    }

    document.addEventListener('pointerdown', onGlobalPointerDown, true)
    return () => document.removeEventListener('pointerdown', onGlobalPointerDown, true)
  }, [openDrawers, tableRef, closeDrawer])

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-x-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-light text-slate-800 tracking-wide">Panel de Puntos</h1>
        <p className="text-slate-600 font-light text-sm sm:text-base">Listado y seguimiento de puntos inspeccionados</p>
      </div>

      <div
        ref={tableRef}
        className="relative z-[7000] mix-blend-lighten bg-white rounded-md shadow-md p-4 space-y-6"
      >
        <ResponsiveTable
          columnDefs={puntosTableColumns}
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
