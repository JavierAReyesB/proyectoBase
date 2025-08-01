'use client'

import React from 'react'
import type { Producto } from '../services/api'
import { Download, AlertTriangle, Eye } from 'lucide-react'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'

interface Props {
  data: Producto
}

export function ProductoDetalletabla({ data }: Props) {
  const columnDefs = [
    { field: 'sede', headerName: 'Sede' },
    {
      field: 'foto',
      headerName: 'Foto',
      maxWidth: 100,
      cellRenderer: (p: { value: string }) => (
        <img
          src={p.value}
          alt="Foto producto"
          className="w-10 h-10 object-cover rounded"
          onError={(e) => {
            e.currentTarget.onerror = null // 🔁 evita bucle infinito
            e.currentTarget.src = '/mock/img/productoprueba.png' // ✅ fallback local
          }}
        />
      )
    }
    ,
    { field: 'nombreProducto', headerName: 'Nombre del Producto' },
    { field: 'registro', headerName: 'Nº Registro' },
    {
      field: 'materiaActiva',
      headerName: 'Materia Activa / Concentración',
      cellRenderer: (p: { value: string }) => (
        <span className="block max-w-[200px] truncate" title={p.value}>
          {p.value}
        </span>
      )
    },
    { field: 'tipoProducto', headerName: 'Tipo de Producto' },
    {
      field: 'estado',
      headerName: 'Estado',
      cellRenderer: (p: { value: string }) => {
        const v = p.value
        const color =
          v === 'Activo'
            ? 'bg-green-500 text-white'
            : v === 'Pendiente'
              ? 'bg-yellow-400 text-black'
              : 'bg-gray-400 text-white'
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
        Detalle del Producto&nbsp;#{data.id}
      </h3>

      <ResponsiveTable
        columnDefs={columnDefs}
        rowData={[data]}
        pagination={false}
      />
    </div>
  )
}
