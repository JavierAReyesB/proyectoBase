'use client'

import type { Aviso } from '../services/api'
import { AvisosFormulario } from './AvisosFormulario'
import { AvisosTabla } from './AvisosTabla'

export function AvisosDrawer({ data }: { data: Aviso }) {
  return (
    <div className="w-full flex flex-col gap-8">
      {/* Formulario (arriba, ancho completo) */}
      <AvisosFormulario data={data} />

      {/* Tabla de detalle (abajo, ancho completo) */}
      <AvisosTabla data={data} />
    </div>
  )
}
 