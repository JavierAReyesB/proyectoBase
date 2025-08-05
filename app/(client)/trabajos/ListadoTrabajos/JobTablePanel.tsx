'use client'

import React, { useEffect, useState } from 'react'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'
import { fetchTrabajos, Trabajo } from './services/api'
import { jobTableColumns } from './columns'
import { useDrawerContext } from '@/components/drawer/DrawerProvider'
import { TrabajoDrawer } from './drawer/TrabajosDrawer'
import { useFiltroTabla } from './hooks/useFiltroTabla'
import { useFiltrosJobs } from './FiltrosJobsContext'

export const JobTablePanel: React.FC = () => {
  const [rowData, setRowData] = useState<Trabajo[]>([])

  const { selectedSede, selectedTipo, searchTerm, showRecords } = useFiltrosJobs()
  const { openDrawer } = useDrawerContext()

  useEffect(() => {
    fetchTrabajos().then(setRowData)
  }, [])

  const tipoKey = 'tipoServicio' as keyof Trabajo   
  const searchKeys = ['cliente', 'descripcion'] as unknown as (keyof Trabajo)[]

  const filteredData = useFiltroTabla<Trabajo>({
    data: rowData,
    selectedSede,
    selectedTipo,
    searchTerm,
    sedeKey: 'sede',
    tipoKey: 'servicio',         
    searchKeys,
  })

  const handleRowClick = (trabajo: Trabajo) => {
    openDrawer({
      id: `trabajo-${trabajo.id}`,
      instanceId: `Trabajo-${trabajo.id}`,
      title: 'Detalle del Trabajo',
      width: 'half',
      isPinned: false,
      icon: null,
      contentKey: 'trabajo',
      contentData: { trabajo },
      content: <TrabajoDrawer data={trabajo} />,
    })
  }

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 py-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-x-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-light text-slate-800 tracking-wide">
          Panel de Gestión
        </h1>
        <p className="text-slate-600 font-light text-sm sm:text-base">
          Sistema de seguimiento y control de servicios
        </p>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-md shadow-md p-4 space-y-6">
        <ResponsiveTable
          columnDefs={jobTableColumns}
          rowData={filteredData}
          pagination
          paginationPageSize={parseInt(showRecords)}
          breakpoint={1024}
          onRowClick={handleRowClick}
        />

        <div className="text-sm text-gray-600 mt-4">
          Mostrando {filteredData.length} de {rowData.length} registros
        </div>
      </div>
    </div>
  )
}
