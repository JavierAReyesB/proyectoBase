'use client'

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  PropsWithChildren,
  ReactNode
} from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ModuleRegistry, AllCommunityModule, GridOptions } from 'ag-grid-community'
import MobileCard, { MobileCardProps } from '../tableAGgrid/MobileCard'
import ScreenLoader from '../loader/ScreenLoader' 

ModuleRegistry.registerModules([AllCommunityModule])

interface ResponsiveTableProps<T extends Record<string, any>> {
  columnDefs: any[]
  rowData: T[]
  /** px a partir de los cuales pasamos a vista móvil (sobre el contenedor) */
  breakpoint?: number
  pagination?: boolean
  paginationPageSize?: number
  /** Render prop para tarjetas móviles; si no se pasa, usa MobileCard */
  renderCard?: (row: T) => ReactNode
  mobileCardProps?: Omit<MobileCardProps<T>, 'data'>
  /** Callback que se dispara al hacer clic/seleccionar una fila */
  onRowClick?: (row: T) => void
  /** GridOptions de AG Grid para extender comportamiento sin tocar el componente */
  gridOptions?: GridOptions<T>
  /** Permite forzar el estado de carga; si no se pasa, se infiere con rowData */
  isLoading?: boolean
}

export default function ResponsiveTable<T extends Record<string, any>>(
  props: PropsWithChildren<ResponsiveTableProps<T>>
) {
  const {
    columnDefs,
    rowData,
    breakpoint = 840,
    pagination = true,
    paginationPageSize,
    renderCard,
    mobileCardProps,
    onRowClick,
    gridOptions = {},
    isLoading
  } = props

  const wrapperRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<AgGridReact<T>>(null)

  const [isMobile, setIsMobile] = useState(false)
  const loading = isLoading ?? rowData.length === 0

  useEffect(() => {
    if (!wrapperRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      setIsMobile(entry.contentRect.width < breakpoint)
      gridRef.current?.api?.sizeColumnsToFit()
    })
    ro.observe(wrapperRef.current)
    return () => ro.disconnect()
  }, [breakpoint])

  const onGridReady = useCallback(
    (params: any) => {
      params.api.sizeColumnsToFit()
      gridOptions?.onGridReady?.(params)
    },
    [gridOptions]
  )

  const handleRowClicked = useCallback(
    (event: any) => {
      onRowClick?.(event.data as T)
      gridOptions?.onRowClicked?.(event)
    },
    [onRowClick, gridOptions]
  )

  /* ---------- VISTA MÓVIL (tarjetas) ---------- */
  if (isMobile) {
    return (
      <div
        data-table-wrapper="true"
        ref={wrapperRef}
        className="relative grid grid-cols-1 gap-4 px-0 sm:px-2 md:px-4 w-full"
      >
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <ScreenLoader tip="Cargando..." />
          </div>
        )}
        {rowData.map((row, idx) => {
          const card = renderCard ? renderCard(row) : (
            <MobileCard data={row} {...mobileCardProps} />
          )
          return onRowClick ? (
            <div key={idx} onClick={() => onRowClick(row)} className="cursor-pointer">
              {card}
            </div>
          ) : (
            <div key={idx}>{card}</div>
          )
        })}
      </div>
    )
  }

  /* ---------- VISTA ESCRITORIO (AG Grid) ---------- */
  return (
    <div
      /* 👇  Este data-attr nos permite identificar la tabla desde DrawerOverlay */
      data-table-wrapper="true"
      ref={wrapperRef}
      className="ag-theme-alpine w-full relative"
      style={{ minHeight: 400 }}
    >
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <ScreenLoader tip="Cargando..." />
        </div>
      )}

      <AgGridReact<T>
        ref={gridRef}
        columnDefs={columnDefs}
        rowData={rowData}
        onGridReady={onGridReady}
        onRowClicked={handleRowClicked}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        domLayout="autoHeight"
        theme="legacy"
        defaultColDef={{
          flex: 1,
          resizable: true,
          sortable: true,
          filter: true,
          minWidth: 120
        }}
        {...gridOptions} //  Permite extender opciones avanzadas
      />
    </div>
  )
}
