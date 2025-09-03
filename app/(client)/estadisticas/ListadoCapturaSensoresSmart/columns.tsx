// ListadoTrabajos/columns.ts
import clsx from 'clsx'
import { Download, Eye, AlertTriangle } from 'lucide-react'
import { ColDef } from 'ag-grid-community'

// Define los posibles resultados y sus clases
const resultadosBadge: Record<string, string> = {
  'Riesgo Nulo': 'bg-gray-300 text-gray-800',
  'Riesgo Medio': 'bg-yellow-300 text-yellow-900',
  'Riesgo Grave': 'bg-red-500 text-white',
}

// Columnas tipadas correctamente
export const jobTableColumns: ColDef[] = [
  { headerName: 'Fecha', field: 'fecha' },
  { headerName: 'Sede', field: 'sede' },
  { headerName: 'Tipo de Trabajo', field: 'tipoTrabajo' },
  { headerName: 'Servicio', field: 'servicio' },
  {
    headerName: 'Operario',
    field: 'operario',
    cellRenderer: (params: { value: string }) => (
      <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
        {params.value}
      </span>
    ),
  },
  {
    headerName: 'Recomendaciones',
    field: 'recomendaciones',
    cellRenderer: (params: { value: string }) => (
      <div className="truncate max-w-[200px]" title={params.value}>
        {params.value}
      </div>
    ),
  },
  {
    headerName: 'Resultado',
    field: 'resultado',
    cellRenderer: (params: { value: string }) => (
      <span
        className={clsx(
          'text-xs font-semibold px-2 py-1 rounded-full',
          resultadosBadge[params.value] || 'bg-gray-200 text-gray-800'
        )}
      >
        {params.value}
      </span>
    ),
  },
  {
    headerName: 'Documentos',
    field: 'acciones',
    cellRenderer: () => (
      <div className="flex gap-2 justify-center items-center">
        <Download size={16} className="text-gray-600 cursor-pointer hover:text-gray-800" />
        <AlertTriangle size={16} className="text-yellow-500 cursor-pointer hover:text-yellow-600" />
        <Eye size={16} className="text-blue-600 cursor-pointer hover:text-blue-800" />
      </div>
    ),
  },
]
