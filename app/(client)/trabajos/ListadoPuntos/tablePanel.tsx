'use client'

import React, { useEffect, useState } from 'react'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'
import { fetchPuntos, Punto } from './services/api'
import { puntosTableColumns } from './columns'
import { useDrawerContext } from '@/components/drawer/DrawerProvider'
import { PuntosDrawer } from './drawer/PuntosDrawer'
import { useFilters } from '../../layout/FiltersContext'  
import { useFiltroTabla } from './hooks/useFiltroTabla'      

export const TablePanel: React.FC = () => {
  const [rowData, setRowData] = useState<Punto[]>([])

  const { selectedSede, selectedTipo, searchTerm, showRecords } = useFilters()

  const { openDrawer } = useDrawerContext()

  useEffect(() => {
    fetchPuntos().then(setRowData)
  }, [])

  const filteredData = useFiltroTabla({
    data: rowData,
    selectedSede,
    selectedTipo,
    searchTerm,
  })

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
      content: <PuntosDrawer data={punto} />,
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

      {/* Tabla */}
      <div className="bg-white rounded-md shadow-md p-4 space-y-6">
        <ResponsiveTable
          columnDefs={puntosTableColumns}
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
