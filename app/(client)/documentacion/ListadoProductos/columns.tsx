// ListadoProductos/columns.tsx
import clsx from 'clsx'
import { Eye, AlertTriangle, Download } from 'lucide-react'
import { ColDef } from 'ag-grid-community'

const estadoBadge: Record<string, string> = {
  Activo: 'bg-green-200 text-green-900',
  Inactivo: 'bg-gray-300 text-gray-700',
  Pendiente: 'bg-yellow-300 text-yellow-900',
}

export const productoTableColumns: ColDef[] = [
  {
    headerName: 'ID',
    field: 'id',
    hide: true, // Oculto pero accesible desde params.data.id
  },
  {
    headerName: 'Sede',
    field: 'sede',
    sortable: true,
    filter: true,
  },
  {
    headerName: 'Foto',
    field: 'foto',
    maxWidth: 100,
    cellRenderer: ({ value }: { value: string }) => (
      <img
        src={value}
        alt="Foto producto"
        className="w-10 h-10 object-cover rounded"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null // 🔁 evita bucle infinito
          e.currentTarget.src = '/mock/img/productoprueba.png' // 👈 usa el nombre correcto
        }}
      />
    ),
  },
  {
    headerName: 'Nombre de Producto',
    field: 'nombreProducto',
    sortable: true,
    filter: true,
  },
  {
    headerName: 'Nº Registro',
    field: 'registro',
    sortable: true,
    filter: true,
  },
  {
    headerName: 'Materia Activa / Concentración',
    field: 'materiaActiva',
    cellRenderer: ({ value }: { value: string }) => (
      <div className="truncate max-w-[200px]" title={value}>
        {value}
      </div>
    ),
  },
  {
    headerName: 'T. Producto',
    field: 'tipoProducto',
    sortable: true,
    filter: true,
  },
  {
    headerName: 'Estado',
    field: 'estado',
    cellRenderer: ({ value }: { value: string }) => (
      <span
        className={clsx(
          'text-xs font-semibold px-2 py-1 rounded-full',
          estadoBadge[value] || 'bg-gray-200 text-gray-700'
        )}
      >
        {value}
      </span>
    ),
  },
  {
    headerName: '',
    field: 'acciones',
    width: 100,
    cellRenderer: ({ data }: any) => (
      <div className="flex gap-2 justify-center items-center">
        <Download
          size={16}
          className="text-gray-600 cursor-pointer hover:text-gray-800"
          onClick={() => console.log('📦 Descargar producto ID:', data.id)}
        />
        <AlertTriangle
          size={16}
          className="text-yellow-500 cursor-pointer hover:text-yellow-600"
        />
        <Eye
          size={16}
          className="text-blue-600 cursor-pointer hover:text-blue-800"
        />
      </div>
    ),
  },
]
