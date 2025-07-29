'use client'

import React, { useEffect, useState } from 'react'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'
import {
  fetchAvisos,
  fetchSedesAviso,
  fetchTiposAviso,
  Aviso
} from './services/api'
import { avisoTableColumns } from './columns'
import AvisosTableFilters from './TableFilters'
import { useDrawerContext } from '@/components/drawer/DrawerProvider'
import { AvisosDrawer } from './drawer/AvisosDrawer'

interface TipoAviso {
  nombre: string
  activo: boolean
}

export const TablePanel: React.FC = () => {
  const [rowData, setRowData] = useState<Aviso[]>([])
  const [sedes, setSedes] = useState<string[]>([])
  const [tiposAviso, setTiposAviso] = useState<TipoAviso[]>([])
  const [selectedSede, setSelectedSede] = useState<string>('')
  const [selectedTipo, setSelectedTipo] = useState<string>('todos')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showRecords, setShowRecords] = useState<string>('10')

  const { openDrawer } = useDrawerContext()

  useEffect(() => {
    fetchAvisos().then(setRowData)
  }, [])

  useEffect(() => {
    fetchSedesAviso().then(setSedes)
  }, [])

  useEffect(() => {
    fetchTiposAviso().then(setTiposAviso)
  }, [])

  const handleRowClick = (aviso: Aviso) => {
    openDrawer({
      id: `aviso-${aviso.id}`,
      instanceId: `aviso-${aviso.id}`,
      title: `Detalle del Aviso`,
      width: 'half',
      isPinned: false,
      icon: null,
      contentKey: 'aviso',
      contentData: { aviso },
      content: <AvisosDrawer data={aviso} />
    })
  }

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 py-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-x-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-light text-slate-800 tracking-wide">
          Panel de Avisos
        </h1>
        <p className="text-slate-600 font-light text-sm sm:text-base">
          Listado y seguimiento de avisos reportados
        </p>
      </div>


      {/* Panel principal */}
      <div className="bg-white rounded-md shadow-md p-4 space-y-6">
        <AvisosTableFilters
          sedes={sedes}
          selectedSede={selectedSede}
          setSelectedSede={setSelectedSede}
          tiposAviso={tiposAviso}
          selectedTipo={selectedTipo}
          setSelectedTipo={setSelectedTipo}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showRecords={showRecords}
          setShowRecords={setShowRecords}
        />

        <ResponsiveTable
          columnDefs={avisoTableColumns}
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
