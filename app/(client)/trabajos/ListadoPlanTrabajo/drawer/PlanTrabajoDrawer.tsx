'use client'

import type { PlanTrabajo } from '../services/api'
import PlanTrabajoFormulario from './PlanTrabajoFormulario'

import { PlanTrabajoTabla } from './PlanTrabajoTabla'

export function PlanTrabajoDrawer({ data }: { data: PlanTrabajo }) {
  return (
    <div className="w-full flex flex-col gap-8">
      {/* Formulario (arriba, ancho completo) */}
      <PlanTrabajoFormulario data={data} />

      {/* Tabla de detalle (abajo, ancho completo) */}
      <PlanTrabajoTabla data={data} />
    </div>
  )
}
