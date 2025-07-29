'use client'

import React, { useEffect, useState } from 'react'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'
import { fetchTrabajos, fetchSedes, fetchTiposServicio, Trabajo } from './services/api'
import { jobTableColumns } from './columns'
import JobTableFilters from './JobTableFilters'
import { useDrawerContext } from '@/components/drawer/DrawerProvider'
import { TrabajoDrawer } from './drawer/TrabajosDrawer' // Asegúrate de tener este archivo creado

interface TipoServicio {
  nombre: string
  activo: boolean
}

export const JobTablePanel: React.FC = () => {
  const [rowData, setRowData] = useState<Trabajo[]>([])
  const [sedes, setSedes] = useState<string[]>([])
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([])
  const [selectedSede, setSelectedSede] = useState<string>('')
  const [selectedTipo, setSelectedTipo] = useState<string>('todos')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showRecords, setShowRecords] = useState<string>('10')

  const { openDrawer } = useDrawerContext()

  useEffect(() => {
    fetchTrabajos().then(setRowData)
  }, [])

  useEffect(() => {
    fetchSedes().then(setSedes)
  }, [])

  useEffect(() => {
    fetchTiposServicio().then(setTiposServicio)
  }, [])

  const handleRowClick = (trabajo: Trabajo) => {
    openDrawer({
      id: `trabajo-${trabajo.id}`,
      instanceId: `trabajo-${trabajo.id}`,
      title: `Detalle del Trabajo`,
      width: 'half',
      isPinned: false, // ✅ NECESARIO para evitar error de tipo
      icon: null,
      contentKey: 'trabajo',
      contentData: { trabajo },
      content: <TrabajoDrawer data={trabajo} />
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


      {/* Panel principal */}
      <div className="bg-white rounded-md shadow-md p-4 space-y-6">
        <JobTableFilters
          sedes={sedes}
          selectedSede={selectedSede}
          setSelectedSede={setSelectedSede}
          tiposServicio={tiposServicio}
          selectedTipo={selectedTipo}
          setSelectedTipo={setSelectedTipo}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showRecords={showRecords}
          setShowRecords={setShowRecords}
        />

        <ResponsiveTable
          columnDefs={jobTableColumns}
          rowData={rowData}
          pagination
          paginationPageSize={parseInt(showRecords)}
          breakpoint={1024}
          onRowClick={handleRowClick}
        />

        <div className="text-sm text-gray-600 mt-4">
          Mostrando registros del 1 al {rowData.length} de un total de {rowData.length} registros
        </div>
      </div>
    </div>
  )
}
