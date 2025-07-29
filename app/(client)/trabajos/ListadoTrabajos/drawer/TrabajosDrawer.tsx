'use client'

import React from 'react'
import type { Trabajo } from '../services/api'
import { TrabajosFormulario } from './TrabajosFormulario'
import { TrabajosTabla } from './TrabajosTabla'

interface Props {
  data: Trabajo
}

export function TrabajoDrawer({ data }: Props) {
  return (
    <div className="w-full flex flex-col gap-8">
      {/* Formulario (arriba, ancho completo) */}
      <TrabajosFormulario data={data} />

      {/* Tabla de detalle (abajo, ancho completo) */}
      <TrabajosTabla data={data} />
    </div>
  )
}
