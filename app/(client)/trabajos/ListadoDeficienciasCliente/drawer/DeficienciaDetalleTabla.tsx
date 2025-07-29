'use client'

import React from 'react'
import type { Deficiencia } from '../services/api'
import { Download, AlertTriangle, Eye } from 'lucide-react'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'

interface Props {
  data: Deficiencia
}

export function DeficienciaDetalleTabla({ data }: Props) {
  const columnDefs = [
    { field: 'fecha', headerName: 'Fecha' },
    { field: 'sede', headerName: 'Sede' },
    { field: 'tipoTrabajo', headerName: 'Tipo de Trabajo' },
    { field: 'servicio', headerName: 'Servicio' },
    {
      field: 'operario',
      headerName: 'Operario',
      cellRenderer: (p: { value: string }) => (
        <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
          {p.value}
        </span>
      )
    },
    { field: 'recomendaciones', headerName: 'Recomendaciones' },
    {
      field: 'resultado',
      headerName: 'Resultado',
      cellRenderer: (p: { value: string }) => {
        const v = p.value
        const color =
          v === 'Riesgo Grave'
            ? 'bg-red-500 text-white'
            : v === 'Riesgo Medio'
            ? 'bg-yellow-400 text-black'
            : 'bg-gray-300 text-gray-800'
        return (
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${color}`}>
            {v}
          </span>
        )
      }
    },
    {
      headerName: 'Documentos',
      cellRenderer: () => (
        <div className="flex gap-2 justify-center">
          <Download className="h-4 w-4 cursor-pointer hover:text-slate-900" />
          <AlertTriangle className="h-4 w-4 cursor-pointer hover:text-yellow-600" />
          <Eye className="h-4 w-4 cursor-pointer hover:text-blue-600" />
        </div>
      )
    }
  ]

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold">
        Detalle de la Deficiencia&nbsp;#{data.id}
      </h3>

      <ResponsiveTable
        columnDefs={columnDefs}
        rowData={[data]}
        pagination={false}
      />
    </div>
  )
}
