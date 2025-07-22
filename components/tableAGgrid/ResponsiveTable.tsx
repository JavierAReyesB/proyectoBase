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
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import MobileCard, { MobileCardProps } from '../tableAGgrid/MobileCard'

ModuleRegistry.registerModules([AllCommunityModule])

interface ResponsiveTableProps<T extends Record<string, any>> {
  columnDefs: any[]
  rowData: T[]
  /** px a partir de los cuales pasamos a vista móvil (sobre el contenedor) */
  breakpoint?: number
  pagination?: boolean
  /** Render prop para tarjetas móviles; si no se pasa, usa MobileCard */
  renderCard?: (row: T) => ReactNode
  mobileCardProps?: Omit<MobileCardProps<T>, 'data'>
  /** Callback que se dispara al hacer clic/seleccionar una fila */
  onRowClick?: (row: T) => void
}

export default function ResponsiveTable<T extends Record<string, any>>(
  props: PropsWithChildren<ResponsiveTableProps<T>>
) {
  const {
    columnDefs,
    rowData,
    breakpoint = 640,
    pagination = true,
    renderCard,
    mobileCardProps,
    onRowClick
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
  }, [])

  const handleRowClicked = useCallback(
    (event: any) => {
      if (onRowClick) {
        onRowClick(event.data as T)
      }
    },
    [onRowClick]
  )

  if (isMobile) {
    return (
      <div
        ref={wrapperRef}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-0 sm:px-2 md:px-4 w-full"
      >

        {rowData.map((row, idx) => {
          const card = renderCard ? renderCard(row) : (
            <MobileCard data={row} {...mobileCardProps} />
          )
          return onRowClick ? (
            <div
              key={idx}
              onClick={() => onRowClick(row)}
              className="cursor-pointer"
            >
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
        theme="legacy"
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
