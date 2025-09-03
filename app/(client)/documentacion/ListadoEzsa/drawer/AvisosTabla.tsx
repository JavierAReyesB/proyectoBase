'use client'

import React from 'react'
import type { Aviso } from '../services/api'
import { Download, AlertTriangle, Eye } from 'lucide-react'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'

interface Props {
  data: Aviso
}

export function AvisosTabla({ data }: Props) {
  const columnDefs = [
    { field: 'fecha', headerName: 'Fecha' },
    { field: 'sede', headerName: 'Sede' },
    { field: 'tipoTrabajo', headerName: 'Tipo de Trabajo' },
    { field: 'servicio', headerName: 'Servicio' },
    { field: 'operario', headerName: 'Operario' },
    {
      field: 'recomendaciones',
      headerName: 'Recomendaciones',
      cellRenderer: (p: { value: string }) => (
        <div className="truncate max-w-[200px]" title={p.value}>
          {p.value}
        </div>
      ),
    },
    { field: 'resultado', headerName: 'Resultado' },
    { field: 'prioridad', headerName: 'Prioridad' },
    {
      headerName: 'Documentos',
      cellRenderer: () => (
        <div className="flex gap-2 justify-center">
          <Download className="h-4 w-4 cursor-pointer hover:text-slate-900" />
          <AlertTriangle className="h-4 w-4 cursor-pointer hover:text-yellow-600" />
          <Eye className="h-4 w-4 cursor-pointer hover:text-blue-600" />
        </div>
      ),
    },
  ]

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold">
        Detalle del Aviso&nbsp;#{data.id}
      </h3>

      <ResponsiveTable
        columnDefs={columnDefs}
        rowData={[data]}
        pagination={false}
      />
    </div>
  )
}
