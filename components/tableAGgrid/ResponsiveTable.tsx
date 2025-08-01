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
    gridOptions = {}
  } = props

  const wrapperRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<AgGridReact<T>>(null)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (!wrapperRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      setIsMobile(entry.contentRect.width < breakpoint)
      gridRef.current?.api?.sizeColumnsToFit()
    })
    ro.observe(wrapperRef.current)
    return () => ro.disconnect()
  }, [breakpoint])

  const onGridReady = useCallback((params: any) => {
    params.api.sizeColumnsToFit()
    gridOptions?.onGridReady?.(params)
  }, [gridOptions])

  const handleRowClicked = useCallback(
    (event: any) => {
      onRowClick?.(event.data as T)
      gridOptions?.onRowClicked?.(event)
    },
    [onRowClick, gridOptions]
  )

  if (isMobile) {
    return (
      <div
        ref={wrapperRef}
        className="grid grid-cols-1 gap-4 px-0 sm:px-2 md:px-4 w-full"
      >
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

  return (
    <div
      ref={wrapperRef}
      className="ag-theme-alpine w-full"
      style={{ minHeight: 400 }}
    >
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
        {...gridOptions} // ⬅️ Permite extender opciones avanzadas
      />
    </div>
  )
}
