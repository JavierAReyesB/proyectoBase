'use client'

import React, { useEffect, useState } from 'react'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'
import {
  fetchPuntos,
  fetchSedesPunto,
  fetchTiposPunto,
  Punto
} from './services/api'
import { puntosTableColumns } from './columns'
import PuntosTableFilters from './tableFilters'
import { useDrawerContext } from '@/components/drawer/DrawerProvider'
import { PuntosDrawer } from './drawer/PuntosDrawer'

interface TipoPunto {
  nombre: string
  activo: boolean
}

export const TablePanel: React.FC = () => {
  const [rowData, setRowData] = useState<Punto[]>([])
  const [sedes, setSedes] = useState<string[]>([])
  const [tiposPunto, setTiposPunto] = useState<TipoPunto[]>([])
  const [selectedSede, setSelectedSede] = useState<string>('')
  const [selectedTipo, setSelectedTipo] = useState<string>('todos')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showRecords, setShowRecords] = useState<string>('10')

  const { openDrawer } = useDrawerContext()

  useEffect(() => {
    fetchPuntos().then(setRowData)
  }, [])

  useEffect(() => {
    fetchSedesPunto().then(setSedes)
  }, [])

  useEffect(() => {
    fetchTiposPunto().then(setTiposPunto)
  }, [])

  const handleRowClick = (punto: Punto) => {
    openDrawer({
      id: `punto-${punto.id}`,
      instanceId: `punto-${punto.id}`,
      title: `Detalle del Punto`,
      width: 'half',
      isPinned: false,
      icon: null,
      contentKey: 'punto',
      contentData: { punto },
      content: <PuntosDrawer data={punto} />
    })
  }

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 py-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-x-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-light text-slate-800 tracking-wide">
          Panel de Puntos
        </h1>
        <p className="text-slate-600 font-light text-sm sm:text-base">
          Listado y seguimiento de puntos inspeccionados
        </p>
      </div>

      {/* Panel principal */}
      <div className="bg-white rounded-md shadow-md p-4 space-y-6">
        <PuntosTableFilters
          sedes={sedes}
          selectedSede={selectedSede}
          setSelectedSede={setSelectedSede}
          tiposPunto={tiposPunto}
          selectedTipo={selectedTipo}
          setSelectedTipo={setSelectedTipo}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showRecords={showRecords}
          setShowRecords={setShowRecords}
        />

        <ResponsiveTable
          columnDefs={puntosTableColumns}
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
