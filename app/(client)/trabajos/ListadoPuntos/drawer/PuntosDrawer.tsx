'use client'

import type { Punto } from '../services/api'
import { PuntosFormulario } from './PuntosFormulario'
import { PuntosTabla } from './PuntosTabla'

export function PuntosDrawer({ data }: { data: Punto }) {
  return (
    <div className="w-full flex flex-col gap-8">
      {/* Formulario (arriba, ancho completo) */}
      <PuntosFormulario data={data} />

      {/* Tabla de detalle (abajo, ancho completo) */}
      <PuntosTabla data={data} />
    </div>
  )
}
