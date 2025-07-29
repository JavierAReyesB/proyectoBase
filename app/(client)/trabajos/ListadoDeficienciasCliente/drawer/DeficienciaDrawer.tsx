'use client'

import type { Deficiencia } from '../services/api'
import { DeficienciaFormulario } from './DeficienciaFormulario'
import { DeficienciaDetalleTabla } from './DeficienciaDetalleTabla'

export function DeficienciaDrawer({ data }: { data: Deficiencia }) {
  return (
    <div className="w-full flex flex-col gap-8">
      {/* Formulario (arriba, ancho completo) */}
      <DeficienciaFormulario data={data} />

      {/* Tabla de detalle (abajo, ancho completo) */}
      <DeficienciaDetalleTabla data={data} />
    </div>
  )
}
