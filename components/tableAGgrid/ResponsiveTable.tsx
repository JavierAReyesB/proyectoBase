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
  breakpoint?: number
  pagination?: boolean
  paginationPageSize?: number
  renderCard?: (row: T) => ReactNode
  mobileCardProps?: Omit<MobileCardProps<T>, 'data'>
  onRowClick?: (row: T) => void
  gridOptions?: GridOptions<T>
  /** Control externo del loading; si no se pasa, se infiere SOLO en la primera carga */
  isLoading?: boolean
  /** Tiempo máximo mostrando loader antes de pasar a “sin datos / tardó demasiado” */
  maxLoadingMs?: number
  /** Tiempo mínimo que se mantiene visible el loader para evitar parpadeo */
  minLoaderMs?: number
  /** Texto para estados vacíos/timeout y error */
  emptyLabel?: string
  timeoutLabel?: string
  errorLabel?: string
  /** Callback para reintentar (mostrará botón en vacío/timeout) */
  onRetry?: () => void
  /** Si hubo error externo, pásalo para mostrar overlay de error */
  hasError?: boolean
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
    isLoading,
    maxLoadingMs = 12000,
    minLoaderMs = 600,
    emptyLabel = 'No hay datos para mostrar.',
    timeoutLabel = 'Se está tardando más de lo normal…',
    errorLabel = 'Ocurrió un error al cargar los datos.',
    onRetry,
    hasError = false
  } = props

  const wrapperRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<AgGridReact<T>>(null)

  const [isMobile, setIsMobile] = useState(false)
  const [hasEverReceivedData, setHasEverReceivedData] = useState(false)
  const [timedOut, setTimedOut] = useState(false)

  // ---- Estado para mínimo de loader (anti-parpadeo)
  const [displayLoading, setDisplayLoading] = useState(false)
  const loadingStartRef = useRef<number | null>(null)

  // Marcar si alguna vez llegaron filas para no confundir “vacío” con “cargando”
  useEffect(() => {
    if (rowData?.length > 0 && !hasEverReceivedData) setHasEverReceivedData(true)
  }, [rowData, hasEverReceivedData])

  // Inferir loading solo antes de la primera llegada de datos
  const inferredLoading = !hasEverReceivedData && (rowData?.length ?? 0) === 0
  const loading = isLoading ?? inferredLoading

  // Timeout de carga
  useEffect(() => {
    if (!loading) {
      setTimedOut(false)
      return
    }
    const id = window.setTimeout(() => setTimedOut(true), maxLoadingMs)
    return () => window.clearTimeout(id)
  }, [loading, maxLoadingMs])

  // Control de mínimo de tiempo del loader
  useEffect(() => {
    if (loading) {
      // Arrancó una sesión de loading
      if (loadingStartRef.current == null) {
        loadingStartRef.current = Date.now()
      }
      setDisplayLoading(true)
      return
    }

    // Terminó el loading -> respetar minLoaderMs antes de ocultar el spinner
    const startedAt = loadingStartRef.current
    if (startedAt == null) {
      setDisplayLoading(false)
      return
    }
    const elapsed = Date.now() - startedAt
    const remaining = Math.max(minLoaderMs - elapsed, 0)

    const id = window.setTimeout(() => {
      setDisplayLoading(false)
      loadingStartRef.current = null
    }, remaining)

    return () => window.clearTimeout(id)
  }, [loading, minLoaderMs])

  // Resize handling
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

  // ---------- Helpers de overlays ----------
  const Overlay = ({ children }: { children: ReactNode }) => (
    <div className="absolute inset-0 z-10 flex flex-col gap-3 items-center justify-center bg-white/60 backdrop-blur-sm">
      {children}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg border shadow-sm bg-white hover:bg-gray-50"
        >
          Reintentar
        </button>
      )}
    </div>
  )

  // Estados derivados para UI
  const showSpinner = displayLoading && !timedOut && !hasError
  const showError = hasError
  const showTimeout = !showError && loading && timedOut
  const showEmpty =
    !showError && !loading && (rowData?.length ?? 0) === 0 && !displayLoading

  /* ---------- VISTA MÓVIL (tarjetas) ---------- */
  if (isMobile) {
    return (
      <div
        data-table-wrapper="true"
        ref={wrapperRef}
        className="relative grid grid-cols-1 gap-4 px-0 sm:px-2 md:px-4 w-full"
      >
        {showSpinner && (
          <Overlay>
            <ScreenLoader tip="Cargando..." />
          </Overlay>
        )}
        {showTimeout && (
          <Overlay>
            <p className="text-sm text-gray-700">{timeoutLabel}</p>
          </Overlay>
        )}
        {showError && (
          <Overlay>
            <p className="text-sm text-red-600">{errorLabel}</p>
          </Overlay>
        )}
        {showEmpty && (
          <Overlay>
            <p className="text-sm text-gray-700">{emptyLabel}</p>
          </Overlay>
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
      data-table-wrapper="true"
      ref={wrapperRef}
      className="ag-theme-alpine w-full relative"
      style={{ minHeight: 400 }}
    >
      {showSpinner && (
        <Overlay>
          <ScreenLoader tip="Cargando..." />
        </Overlay>
      )}
      {showTimeout && (
        <Overlay>
          <p className="text-sm text-gray-700">{timeoutLabel}</p>
        </Overlay>
      )}
      {showError && (
        <Overlay>
          <p className="text-sm text-red-600">{errorLabel}</p>
        </Overlay>
      )}
      {showEmpty && (
        <Overlay>
          <p className="text-sm text-gray-700">{emptyLabel}</p>
        </Overlay>
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
        {...gridOptions}
      />
    </div>
  )
}
