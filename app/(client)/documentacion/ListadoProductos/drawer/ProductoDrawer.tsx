'use client'

import type { Producto } from '../services/api'
import { ProductoDetalletabla } from './ProductoDetalleTabla'
import { ProductoFormulario } from './ProductoFormulario'

export function ProductoDrawer({ data }: { data: Producto }) {
  return (
    <div className="w-full flex flex-col gap-8">
      {/* Formulario de edición del producto */}
      <ProductoFormulario data={data} />

      {/* Tabla con detalle del producto */}
      <ProductoDetalletabla data={data} />
    </div>
  )
}
