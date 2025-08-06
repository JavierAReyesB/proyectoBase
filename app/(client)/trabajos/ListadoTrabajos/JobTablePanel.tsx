// JobTablePanel.tsx
'use client'

import React, { useContext, useEffect, useState } from 'react'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'
import { fetchTrabajos, type Trabajo } from './services/api'
import { jobTableColumns } from './columns'
import { useDrawerContext } from '@/components/drawer/DrawerProvider'
import { TrabajoDrawer } from './drawer/TrabajosDrawer'
import { useFiltroTabla } from './hooks/useFiltroTabla'
import { useFiltrosJobs } from './FiltrosJobsContext'
import { TableContext } from '@/components/TableContext'       // ref global

export const JobTablePanel: React.FC = () => {
  const [rowData, setRowData] = useState<Trabajo[]>([])

  // filtros externos
  const { selectedSede, selectedTipo, searchTerm, showRecords } = useFiltrosJobs()

  // drawer context
  const { openDrawers, openDrawer, updateDrawer } = useDrawerContext()

  // ref global a la tabla (compartida con DrawerOverlay)
  const tableRef = useContext(TableContext)!                   // <- MISMA ref

  // cargar data
  useEffect(() => {
    fetchTrabajos().then(setRowData)
  }, [])

  // aplicar filtros
  const filteredData = useFiltroTabla<Trabajo>({
    data: rowData,
    selectedSede,
    selectedTipo,
    searchTerm,
    sedeKey: 'sede',
    tipoKey: 'servicio',
    searchKeys: ['id'] as (keyof Trabajo)[]
  })

  /** Maneja el clic en una fila */
  const handleRowClick = (trabajo: Trabajo) => {
    const mainId = 'drawer-trabajo'
    const main   = openDrawers.find(d => d.id === mainId)

    const drawerData = {
      instanceId:  `Trabajo-${trabajo.id}`,
      contentKey:  'trabajo',
      contentData: { trabajo },
      content:     <TrabajoDrawer data={trabajo} />,
      hideBackdrop: true
    }

    if (main && main.width !== 'full' && !main.isPinned) {
      updateDrawer(mainId, drawerData)          // refresca
      return
    }

    openDrawer({
      id:       main ? `trabajo-${trabajo.id}` : mainId,
      title:    'Detalle del Trabajo',
      width:    'half',
      isPinned: false,
      icon:     null,
      ...drawerData
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
      <div
  ref={tableRef}
  className="relative z-[7000] mix-blend-lighten bg-white rounded-md shadow-md p-4 space-y-6"
>
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
