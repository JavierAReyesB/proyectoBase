'use client'

import { useEffect, useState, useRef, useCallback, PropsWithChildren, ReactNode } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import MobileCard, { MobileCardProps } from '../tableAGgrid/MobileCard'

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
ModuleRegistry.registerModules([AllCommunityModule])

/* ---------- tipos ---------- */
interface ResponsiveTableProps<T extends Record<string, any>> {
  columnDefs: any[]
  rowData: T[]
  /** px a partir de los cuales pasamos a vista móvil (sobre el CONTENEDOR) */
  breakpoint?: number
  pagination?: boolean
  renderCard?: (row: T) => ReactNode
  mobileCardProps?: Omit<MobileCardProps<T>, 'data'>
}

/* ---------- componente ---------- */
export default function ResponsiveTable<T extends Record<string, any>>(
  props: PropsWithChildren<ResponsiveTableProps<T>>
) {
  const {
    columnDefs,
    rowData,
    breakpoint = 640,
    pagination = true,
    renderCard,
    mobileCardProps
  } = props

  /* refs ------------------------------------------------------------- */
  const wrapperRef = useRef<HTMLDivElement>(null)   // mide ancho contenedor
  const gridRef    = useRef<AgGridReact<T>>(null)   // acceso a API grid

  /* móvil / escritorio ---------------------------------------------- */
  const [isMobile, setIsMobile] = useState(false)

  /* observa cambios de tamaño en el contenedor ---------------------- */
  useEffect(() => {
    if (!wrapperRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      setIsMobile(entry.contentRect.width < breakpoint)
      gridRef.current?.api?.sizeColumnsToFit()      // refit si cambia
    })
    ro.observe(wrapperRef.current)
    return () => ro.disconnect()
  }, [breakpoint])

  /* auto‑fit inicial (usa params.api) ------------------------------- */
  const onGridReady = useCallback((params: any) => {
    params.api.sizeColumnsToFit()
  }, [])

  /* ---------- MÓVIL / TABLET ---------- */
  if (isMobile) {
    return (
      <div ref={wrapperRef} className="space-y-4">
        {rowData.map((row, idx) =>
          renderCard ? (
            <div key={idx}>{renderCard(row)}</div>
          ) : (
            <MobileCard key={idx} data={row} {...mobileCardProps} />
          )
        )}
      </div>
    )
  }

  /* ---------- ESCRITORIO ---------- */
  return (
    <div ref={wrapperRef} className="ag-theme-alpine w-full" style={{ minHeight: 400 }}>
      <AgGridReact<T>
        ref={gridRef}
        columnDefs={columnDefs}
        rowData={rowData}
        onGridReady={onGridReady}
        theme="legacy"                 /* evita mezcla Quartz vs CSS */
        domLayout="autoHeight"
        pagination={pagination}
        paginationAutoPageSize
        defaultColDef={{
          flex: 1,
          resizable: true,
          sortable: true,
          filter: true,
          minWidth: 120
        }}
      />
    </div>
  )
}
