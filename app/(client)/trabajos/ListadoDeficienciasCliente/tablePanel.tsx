'use client'

import React, { useEffect, useState } from 'react'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'
import {
  fetchDeficiencias,
  fetchSedesDef,
  fetchTiposServicioDef,
  fetchCategoriasDef,
  Deficiencia
} from './services/api'
import { jobTableColumns } from './columns'
import JobTableFilters from './tablefilters'
import { useDrawerContext } from '@/components/drawer/DrawerProvider'
import { DeficienciaDrawer } from './drawer/DeficienciaDrawer'


interface TipoServicio {
  nombre: string
  activo: boolean
}

export const DeficienciaTablePanel: React.FC = () => {
  const [rowData, setRowData] = useState<Deficiencia[]>([])
  const [sedes, setSedes] = useState<string[]>([])
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([])
  const [selectedSede, setSelectedSede] = useState<string>('')
  const [selectedTipo, setSelectedTipo] = useState<string>('todos')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showRecords, setShowRecords] = useState<string>('10')
  const [categorias, setCategorias] = useState<string[]>([])
  const [selectedCategoria, setSelectedCategoria] = useState<string>('todas')


  const { openDrawer } = useDrawerContext()

  useEffect(() => {
    fetchDeficiencias().then(setRowData)
  }, [])

  useEffect(() => {
    fetchSedesDef().then(setSedes)
  }, [])

  useEffect(() => {
    fetchTiposServicioDef().then(setTiposServicio)
  }, [])

  useEffect(() => {
    fetchCategoriasDef().then(setCategorias)
  }, [])


  const handleRowClick = (row: Deficiencia) => {
    openDrawer({
      id: `deficiencia-${row.id}`,
      instanceId: `deficiencia-${row.id}`,
      title: `Deficiencia #${row.id}`,
      width: 'half',
      isPinned: false,
      icon: null,
      contentKey: 'deficiencia',
      contentData: row,
      content: <DeficienciaDrawer data={row} />

    })
  }

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 py-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-x-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-light text-slate-800 tracking-wide">
          Panel de Deficiencias
        </h1>
        <p className="text-slate-600 font-light text-sm sm:text-base">
          Listado y seguimiento de riesgos detectados
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
          categorias={categorias}
          selectedCategoria={selectedCategoria}
          setSelectedCategoria={setSelectedCategoria}
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
