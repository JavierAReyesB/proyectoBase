'use client'

import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'
import { fetchTrabajos, type Trabajo } from './services/api'
import { jobTableColumns } from './columns'
import { useDrawerContext } from '@/components/drawer/DrawerProvider'
import { TrabajoDrawer } from './drawer/TrabajosDrawer'
import { useFiltroTabla } from './hooks/useFiltroTabla'
import { useFiltrosJobs } from './FiltrosJobsContext'
import { TableContext } from '@/components/TableContext'

// Mapa
import SpainZoomableMap from '../../../../components/mapaGrafico/SpainZoomableMap'

declare global {
  interface Window {
    __skipNextDrawerOutsideClose?: boolean
  }
}

export const JobTablePanel: React.FC = () => {
  const [rowData, setRowData] = useState<Trabajo[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  const { selectedSede, selectedTipo, searchTerm, showRecords } = useFiltrosJobs()
  const { openDrawers, openDrawer, updateDrawer, closeDrawer } = useDrawerContext() as any
  const tableRef = useContext(TableContext)!
  const primaryDrawerIdRef = useRef<string | null>(null)

  useEffect(() => {
    fetchTrabajos().then(setRowData)
  }, [])

  // Filtro base
  const filteredDataBase = useFiltroTabla<Trabajo>({
    data: rowData,
    selectedSede,
    selectedTipo,
    searchTerm,
    sedeKey: 'sede',
    tipoKey: 'servicio',
    searchKeys: ['id'] as (keyof Trabajo)[],
  })

  // Conteo por región para colorear el mapa
  const countsByRegion = useMemo(() => {
    const acc: Record<string, number> = {}
    for (const r of rowData) {
      const key =
        (r as any).sede ??
        (r as any).region ??
        (r as any).provincia ??
        (r as any).comunidad ??
        'Sin región'
      acc[key] = (acc[key] || 0) + 1
    }
    return acc
  }, [rowData])

  // Filtro extra del mapa
  const filteredData = useMemo(() => {
    if (!selectedRegion || selectedRegion === 'Sin región') return filteredDataBase
    return filteredDataBase.filter((r) => {
      const region =
        (r as any).sede ??
        (r as any).region ??
        (r as any).provincia ??
        (r as any).comunidad
      return region === selectedRegion
    })
  }, [filteredDataBase, selectedRegion])

  // 📊 Estadísticas para el panel derecho
  const regionStats = useMemo(() => {
    if (!selectedRegion || selectedRegion === 'Sin región') return null
    const rows = filteredDataBase.filter((r) => {
      const region =
        (r as any).sede ??
        (r as any).region ??
        (r as any).provincia ??
        (r as any).comunidad
      return region === selectedRegion
    })
    const total = rows.length
    const percent = rowData.length ? Math.round((total / rowData.length) * 100) : 0

    const byServicio: Record<string, number> = {}
    for (const r of rows) {
      const k = (r as any).servicio ?? 'Sin servicio'
      byServicio[k] = (byServicio[k] || 0) + 1
    }
    const topServicios = Object.entries(byServicio)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)

    return { total, percent, topServicios }
  }, [selectedRegion, filteredDataBase, rowData.length])

  // Click en fila (igual que tenías)
  const handleRowClick = (trabajo: Trabajo) => {
    const uniqueId = `trabajo-${trabajo.id}`
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

    if (primary && primary.width !== 'full' && !primary.isPinned) {
      updateDrawer(primary.id, drawerData)
      return
    }

    const existing = openDrawers.find((d: any) => d.id === uniqueId || d.instanceId === instanceId)
    if (existing) {
      updateDrawer(existing.id, drawerData)
      if (!primary || primary.width === 'full' || primary.isPinned) {
        primaryDrawerIdRef.current = existing.id
      }
      return
    }

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

  // ───────────────────────────────────────────────────────────────────────────
  // Click-away drawers (Radix-aware): evita cerrar el drawer si un Select/Popover
  // estaba abierto o el gesto empezó dentro de su popper.
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!openDrawers?.length) return

    // Helpers Radix
    const hasOpenRadixPopper = () =>
      !!(
        document.querySelector('[data-radix-popper-content-wrapper] [data-state="open"]') ||
        document.querySelector('[data-radix-popper-content-wrapper]')
      )

    const isInsideRadixPopper = (target: EventTarget | null, path?: EventTarget[]) => {
      const match = (el: EventTarget | null) =>
        el instanceof HTMLElement &&
        !!el.closest?.('[data-radix-popper-content-wrapper]')
      if (match(target)) return true
      if (Array.isArray(path)) for (const el of path) if (match(el)) return true
      return false
    }

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

    const isDrawerControlClick = (el: HTMLElement | null) => {
      if (!el) return false
      const SELECTOR = [
        '[data-drawer-action]',
        '[data-drawer-minimize]',
        '[data-drawer-pin]',
        '[data-drawer-close]',
        '[data-drawer-toggle]',
        '.drawer-minimize',
        '.drawer-pin',
        '.drawer-close',
        '.drawer-toggle',
        'button',
        '[role="button"]',
      ].join(',')
      try {
        return !!el.closest(SELECTOR) && isInsideDrawer(el as HTMLElement)
      } catch {
        return false
      }
    }

    const onGlobalPointerDown = (e: PointerEvent) => {
      if (!openDrawers?.length) return
      if (e.button !== 0) return

      const target = e.target as HTMLElement | null
      const path = (e.composedPath?.() as EventTarget[]) ?? undefined
      const tableEl = (tableRef as React.MutableRefObject<HTMLDivElement | null>)?.current

      // 1) Si el gesto empieza dentro de un popper Radix o hay popper abierto en PD → marcar y salir
      if (isInsideRadixPopper(target, path) || hasOpenRadixPopper()) {
        window.__skipNextDrawerOutsideClose = true
        return
      }

      // 2) Si viene marcado por PD previo (p.ej. otro listener/overlay) → consumir y salir
      if (window.__skipNextDrawerOutsideClose) {
        window.__skipNextDrawerOutsideClose = false
        return
      }

      // 3) Reglas normales de exclusión
      if (target && isInsideDrawer(target)) return
      if (isDrawerControlClick(target)) return
      if (tableEl && target && tableEl.contains(target)) return

      // 4) Cerrar el top si no está pineado
      const top = openDrawers[openDrawers.length - 1]
      if (top && !top.isPinned) closeDrawer?.(top.id)
    }

    document.addEventListener('pointerdown', onGlobalPointerDown, true)
    return () => document.removeEventListener('pointerdown', onGlobalPointerDown, true)
  }, [openDrawers, tableRef, closeDrawer])

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 py-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-x-4 mb-2">
        <h1 className="text-2xl sm:text-3xl font-light text-slate-800 tracking-wide">
          Panel de Gestión
        </h1>
        <p className="text-slate-600 font-light text-sm sm:text-base">
          Sistema de seguimiento y control de servicios
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[720px_minmax(0,1fr)] gap-4 items-start">
        {/* MAPA */}
        <div className="rounded-md border bg-white p-2">
          <div className="aspect-[975/610]">
            <SpainZoomableMap
              // datasets
              dataUrl="https://unpkg.com/es-atlas/es/autonomous_regions.json"
              provincesUrl="https://unpkg.com/es-atlas/es/provinces.json"
              municipalitiesUrl="https://unpkg.com/es-atlas/es/municipalities.json"
              // modos
              initialClickBehavior="zoom-drill"
              showToolbar
              enableMunicipalLevel={true}
              // visual
              width={975}
              height={610}
              fillByName={countsByRegion}
              selectedName={selectedRegion ?? undefined}
              // evento selección
              onRegionClick={(name) => setSelectedRegion(name)}
            />
          </div>
        </div>

        {/* Panel derecho (stats) */}
        <aside className="rounded-md border bg-white p-4 sticky top-4 self-start">
          {selectedRegion ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-800">
                  {selectedRegion}
                </h3>
                {regionStats && (
                  <span className="text-sm text-slate-600">
                    {regionStats.total} trabajos ({regionStats.percent}%)
                  </span>
                )}
              </div>

              {regionStats ? (
                <>
                  <div className="text-xs text-slate-500 mb-1">Top servicios</div>
                  <ul className="text-sm space-y-1">
                    {regionStats.topServicios.map(([svc, n]) => (
                      <li key={svc} className="flex items-center justify-between">
                        <span className="truncate">{svc}</span>
                        <span className="tabular-nums">{n}</span>
                      </li>
                    ))}
                    {!regionStats.topServicios.length && (
                      <li className="text-slate-500">Sin datos</li>
                    )}
                  </ul>

                  <button
                    className="mt-4 text-xs px-2 py-1 rounded border border-slate-300 hover:bg-slate-50"
                    onClick={() => setSelectedRegion(null)}
                    title="Quitar filtro del mapa"
                  >
                    Limpiar filtro
                  </button>
                </>
              ) : (
                <p className="text-sm text-slate-500">Sin datos para esta región.</p>
              )}
            </>
          ) : (
            <div className="text-sm text-slate-600">
              Selecciona una región en el mapa para ver el resumen aquí.
            </div>
          )}
        </aside>
      </div>

      {/* Tabla */}
      <div
        ref={tableRef}
        className="relative z-[7000] bg-white rounded-md shadow-md p-4 space-y-6"
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
