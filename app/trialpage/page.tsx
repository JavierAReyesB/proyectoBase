'use client'

import { useEffect, useState } from 'react'
import { PageWrapper } from '@/app/layout/PageWrapper'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'
import type { ColDef } from 'ag-grid-community'

/* ---------- Tipado de la fila ---------- */
interface Proyecto {
  id: number
  nombre: string
  cliente: string
  estado: 'En curso' | 'Pendiente' | 'Finalizado'
  fechaInicio: string
  fechaFin: string
  presupuesto: number
  responsable: string
  departamento: string
  prioridad: 'Alta' | 'Media' | 'Baja'
  tecnologia: string
  observaciones: string
}

/* ---------- ColumnDefs para AG Grid ---------- */
const columnDefs: ColDef<Proyecto>[] = [
  { field: 'id', headerName: 'ID', maxWidth: 90 },
  { field: 'nombre', headerName: 'Proyecto', minWidth: 180 },
  { field: 'cliente', headerName: 'Cliente', minWidth: 160 },
  {
    field: 'estado',
    headerName: 'Estado',
    cellClass: (params) =>
      params.value === 'Finalizado'
        ? 'text-green-600 font-semibold'
        : params.value === 'Pendiente'
        ? 'text-yellow-600 font-semibold'
        : 'text-blue-600 font-semibold'
  },
  {
    field: 'fechaInicio',
    headerName: 'Inicio',
    valueFormatter: (p) =>
      new Date(p.value).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
    minWidth: 120
  },
  {
    field: 'fechaFin',
    headerName: 'Fin',
    valueFormatter: (p) =>
      new Date(p.value).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
    minWidth: 120
  },
  {
    field: 'presupuesto',
    headerName: 'Presupuesto (€)',
    valueFormatter: (p) => `${p.value.toLocaleString('es-ES')} €`,
    minWidth: 140
  },
  { field: 'responsable', headerName: 'Responsable', minWidth: 140 },
  { field: 'departamento', headerName: 'Departamento', minWidth: 120 },
  { field: 'prioridad', headerName: 'Prioridad', minWidth: 100 },
  { field: 'tecnologia', headerName: 'Tecnología', minWidth: 100 },
  { field: 'observaciones', headerName: 'Observaciones', minWidth: 200 }
]

/* ---------- Página ---------- */
export default function TrialPage() {
  const [rowData, setRowData] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/mock/proyectos.json')
      .then((res) => res.json())
      .then((data: Proyecto[]) => {
        setRowData(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error cargando proyectos:', error)
        setLoading(false)
      })
  }, [])

  return (
    <PageWrapper
      title='Tabla de Proyectos (Demo AG Grid)'
      description='Ejemplo responsive con datos desde JSON simulado.'
    >
      <div className='mt-6'>
        {loading ? (
          <p className='text-center text-gray-600'>Cargando datos...</p>
        ) : (
          <ResponsiveTable<Proyecto>
            columnDefs={columnDefs}
            rowData={rowData}
            breakpoint={1024}
            pagination
            mobileCardProps={{
              titleField: 'nombre',
              hiddenFields: ['id', 'presupuesto'],
              defaultCompact: true
            }}
          />
        )}
      </div>
    </PageWrapper>
  )
}
