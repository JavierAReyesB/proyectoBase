import { DeficienciaDetalleTabla } from './DeficienciaDetalleTabla'
import { DeficienciaFormulario } from './DeficienciaFormulario'
import type { Deficiencia } from '../services/api'

export function DeficienciaDrawer({ data }: { data: Deficiencia }) {
  return (
    <div className="w-full flex flex-col gap-6">
      <DeficienciaDetalleTabla data={data} />
      <DeficienciaFormulario data={data} />
    </div>
  )
}

