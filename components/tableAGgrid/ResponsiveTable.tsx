'use client'

/* -------------------------------------------------------------
 *  IMPORTS BÁSICOS
 * ----------------------------------------------------------- */
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  PropsWithChildren,
  ReactNode
} from 'react'

import MobileCard, { MobileCardProps } from '../tableAGgrid/MobileCard'

/* ➜  IMPORTA el módulo de estilos con el efecto glass */
import styles from './ResponsiveTable.module.css'

/* -------------------------------------------------------------
 *  REGISTRO DE MÓDULOS – AG GRID COMMUNITY v34+
 * ----------------------------------------------------------- */
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
ModuleRegistry.registerModules([AllCommunityModule])

/* -------------------------------------------------------------
 *  TIPOS DE PROPS
 * ----------------------------------------------------------- */
interface ResponsiveTableProps<T extends Record<string, any>> {
  columnDefs: any[]
  rowData: T[]
  breakpoint?: number
  pagination?: boolean
  renderCard?: (row: T) => ReactNode
  mobileCardProps?: Omit<MobileCardProps<T>, 'data'>
}

/* -------------------------------------------------------------
 *  COMPONENTE
 * ----------------------------------------------------------- */
export default function ResponsiveTable<T extends Record<string, any>>(
  props: PropsWithChildren<ResponsiveTableProps<T>>
) {
  const {
    columnDefs,
    rowData,
    breakpoint = 1024,
    pagination = true,
    renderCard,
    mobileCardProps
  } = props

  const [isMobile, setIsMobile] = useState(false)
  const gridRef = useRef<AgGridReact<T>>(null)

  /* Detectar tamaño de pantalla */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])

  /* Ajustar columnas al ancho */
  const onGridReady = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit()
  }, [])

  /* --------- MÓVIL / TABLET --------- */
  if (isMobile) {
    return (
      <div className='space-y-4'>
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

  /* --------- ESCRITORIO --------- */
  return (
    <div
      className='ag-theme-alpine glass-table w-full'
      style={{ minHeight: 400 }}
    >
      <AgGridReact<T>
        theme='legacy'
        ref={gridRef}
        columnDefs={columnDefs}
        rowData={rowData}
        onGridReady={onGridReady}
        domLayout='autoHeight'
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
