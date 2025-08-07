'use client'

import React, { useContext, useEffect, useState } from 'react'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'
import {
  fetchDeficiencias,
  Deficiencia
} from './services/api'
import { jobTableColumns } from './columns'
import { useDrawerContext } from '@/components/drawer/DrawerProvider'
import { DeficienciaDrawer } from './drawer/DeficienciaDrawer'
import { useFiltroTabla } from './hooks/useFiltroTabla'
import { useFiltrosDeficiencias } from './FiltrosDeficienciasContext'
import { TableContext } from '@/components/TableContext'

export const DeficienciaTablePanel: React.FC = () => {
  const [rowData, setRowData] = useState<Deficiencia[]>([])

  const {
    selectedSede,
    selectedTipo,
    selectedCategoria,
    searchTerm,
    showRecords
  } = useFiltrosDeficiencias()

  const { openDrawers, openDrawer, updateDrawer } = useDrawerContext()
  const tableRef = useContext(TableContext)!

  useEffect(() => {
    fetchDeficiencias().then(setRowData)
  }, [])

  const filteredData = useFiltroTabla<Deficiencia>({
    data: rowData,
    selectedSede,
    selectedTipo,
    selectedCategoria,
    searchTerm,
    sedeKey: 'sede',
    tipoKey: 'servicio',
    categoriaKey: 'tipoTrabajo',
    searchKeys: ['id'] as (keyof Deficiencia)[]
  })

  const handleRowClick = (def: Deficiencia) => {
    const mainId = 'drawer-deficiencia'
    const main = openDrawers.find(d => d.id === mainId)

    const drawerData = {
      instanceId: `Deficiencia-${def.id}`,
      contentKey: 'deficiencia',
      contentData: { def },
      content: <DeficienciaDrawer data={def} />,
      hideBackdrop: true
    }

    if (main && main.width !== 'full' && !main.isPinned) {
      updateDrawer(mainId, drawerData)
      return
    }

    openDrawer({
      id: main ? `deficiencia-${def.id}` : mainId,
      title: 'Detalle de Deficiencia',
      width: 'half',
      isPinned: false,
      icon: null,
      ...drawerData
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
          Listado y control de deficiencias detectadas
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
          mobileCardProps={{
            titleField: 'sede',
            collapsedFields: ['estado', 'tipoTrabajo'],
            hiddenFields: [],
            expandedFieldOrder: [
              'fecha',
              'sede',
              'tipoTrabajo',
              'servicio',
              'operario',
              'recomendaciones',
              'criticidad',
              'resultado',
              'estado'
            ]
          }}
        />

        <div className="text-sm text-gray-600 mt-4">
          Mostrando {filteredData.length} de {rowData.length} registros
        </div>
      </div>
    </div>
  )
}
