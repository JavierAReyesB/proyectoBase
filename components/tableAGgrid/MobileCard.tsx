'use client'

import { useState } from 'react'
import { Expand, Shrink } from 'lucide-react'
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
    'w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4 space-y-2',
    'bg-white dark:bg-gray-900 transition-all'
  )}
>
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        {/* Este es el área que podría abrir un drawer si lo deseas */}
        <h3
          className="font-semibold text-sm cursor-pointer"
          onClick={() => {
            // Aquí podrías llamar a una función como abrirDrawer()
            console.log('Drawer abierto o acción externa');
          }}
        >
          {titleField ? String(data[titleField]) : 'Detalle'}
        </h3>

        {/* Solo este botón controla el expand/colapsar */}
        <button
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          onClick={(e) => {
            e.stopPropagation()
            setCompact(!compact)
          }}
        >
          {compact ? <Expand size={18} /> : <Shrink size={18} />}
        </button>
      </div>

      {/* Contenido */}
      {/* Contenido estilo formulario: dos columnas en móvil, observaciones a ancho completo */}
      <div
        className={clsx(
          compact && 'hidden',
          'grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-[13px] leading-tight w-full'
        )}
      >
        {visibleEntries.map(([key, value]) => {
          const isObservaciones = key.toLowerCase() === 'observaciones'
          return (
            <div
              key={`entry-${key}`}
              className={clsx(
                'flex flex-col col-span-1',
                isObservaciones && 'col-span-2 sm:col-span-3'
              )}
            >
              <span className="text-[12px] text-gray-500 dark:text-gray-400 font-medium capitalize mb-0.5">
                {key}:
              </span>
              <span className="text-[13px] text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words font-normal">
                {String(value ?? '—')}
              </span>
            </div>
          )
        })}
      </div>


    </div>
  )
}
