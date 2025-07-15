'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react' // Usa tu icon pack favorito
import clsx from 'clsx'

export interface MobileCardProps<T extends Record<string, any>> {
  /** Objeto con todos los datos de la fila */
  data: T
  /** Clave cuyo valor se mostrará como título en modo compacto */
  titleField?: keyof T
  /** Campos que NO deseas mostrar */
  hiddenFields?: (keyof T)[]
  /** Si parte en modo compacto */
  defaultCompact?: boolean
}

/** Tarjeta genérica, no acoplada a “pagos” ni a ningún dominio. */
export default function MobileCard<T extends Record<string, any>>({
  data,
  titleField,
  hiddenFields = [],
  defaultCompact = true
}: MobileCardProps<T>) {
  const [compact, setCompact] = useState(defaultCompact)

  const visibleEntries = Object.entries(data).filter(
    ([key]) => !hiddenFields.includes(key as keyof T)
  )

  return (
    <div
      className={clsx(
        'rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4 space-y-2',
        'bg-white dark:bg-gray-900 transition-all'
      )}
    >
      {/* Encabezado */}
      <div
        className='flex justify-between items-center cursor-pointer'
        onClick={() => setCompact(!compact)}
      >
        <h3 className='font-semibold text-sm'>
          {titleField ? String(data[titleField]) : 'Detalle'}
        </h3>
        {compact ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </div>

      {/* Contenido */}
      <div className={clsx(compact && 'hidden', 'text-xs')}>
        {visibleEntries.map(([key, value]) => (
          <div key={key} className='flex justify-between gap-2 py-[2px]'>
            <span className='font-medium'>{key}:</span>
            <span className='truncate'>{String(value ?? '—')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
