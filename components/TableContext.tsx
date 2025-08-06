import {
  createContext,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react'

/**
 * Contexto global con la ref de la tabla.
 *
 *  ✱  TIPO EXACTO  ✱
 *  ─────────────────
 *  useRef<HTMLDivElement>(null) →  RefObject<HTMLDivElement | null>
 *  Por eso el genérico del contexto debe admitir  | null  *dentro*.
 */
export const TableContext =
  createContext<RefObject<HTMLDivElement | null> | null>(null)

export function TableContextProvider({ children }: { children: ReactNode }) {
  /* tableRef tiene tipo  MutableRefObject<HTMLDivElement | null>  */
  const tableRef = useRef<HTMLDivElement>(null)

  return (
    /* ✔︎  tableRef encaja en RefObject<HTMLDivElement | null> | null */
    <TableContext.Provider value={tableRef}>{children}</TableContext.Provider>
  )
}
