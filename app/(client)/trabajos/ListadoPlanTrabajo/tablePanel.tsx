'use client'

import React, { useEffect, useState } from 'react'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'
import {
    fetchPlanesTrabajo,
    fetchSedesPlan,
    fetchTiposServicioPlan,
    fetchCategoriasPlan,
    fetchContratosPlan,
    PlanTrabajo,
    Contrato
} from './services/api'
import { planTrabajoColumns } from './columns'
import PlanTrabajoTableFilters from './tableFilters'
import { useDrawerContext } from '@/components/drawer/DrawerProvider'
import { PlanTrabajoDrawer } from './drawer/PlanTrabajoDrawer'

interface TipoServicio {
    nombre: string
    activo: boolean
}

export const PlanTrabajoTablePanel: React.FC = () => {
    const [rowData, setRowData] = useState<PlanTrabajo[]>([])
    const [sedes, setSedes] = useState<string[]>([])
    const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([])
    const [selectedSede, setSelectedSede] = useState<string>('')
    const [selectedTipo, setSelectedTipo] = useState<string>('todos')
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [showRecords, setShowRecords] = useState<string>('10')
    const [categorias, setCategorias] = useState<string[]>([])
    const [selectedCategoria, setSelectedCategoria] = useState<string>('todas')
    const [contratos, setContratos] = useState<Contrato[]>([])
    const [selectedContrato, setSelectedContrato] = useState<string>('todos')

    const { openDrawer } = useDrawerContext()

    useEffect(() => {
        fetchPlanesTrabajo().then(setRowData)
    }, [])

    useEffect(() => {
        fetchSedesPlan().then(setSedes)
    }, [])

    useEffect(() => {
        fetchTiposServicioPlan().then(setTiposServicio)
    }, [])

    useEffect(() => {
        fetchCategoriasPlan().then(setCategorias)
    }, [])

    useEffect(() => {
        fetchContratosPlan().then(setContratos)
    }, [])

    const handleRowClick = (row: PlanTrabajo) => {
        openDrawer({
            id: `plantrabajo-${row.id}`,
            instanceId: `Plan de Trabajo-${row.id}`,
            title: `Plan de Trabajo`, 
            width: 'half',
            isPinned: false,
            icon: null,
            contentKey: 'plantrabajo',
            contentData: row,
            content: <PlanTrabajoDrawer data={row} />
        })
    }

    return (
        <div className="space-y-6 px-2 sm:px-4 md:px-6 py-6">
            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-x-4 mb-4">
                <h1 className="text-2xl sm:text-3xl font-light text-slate-800 tracking-wide">
                    Panel de Planes de Trabajo
                </h1>
                <p className="text-slate-600 font-light text-sm sm:text-base">
                    Listado y seguimiento de trabajos programados
                </p>
            </div>

            {/* Panel principal */}
            <div className="bg-white rounded-md shadow-md p-4 space-y-6">
                <PlanTrabajoTableFilters
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
                    contratos={contratos}
                    selectedContrato={selectedContrato}
                    setSelectedContrato={setSelectedContrato}
                />

                <ResponsiveTable
                    columnDefs={planTrabajoColumns}
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
