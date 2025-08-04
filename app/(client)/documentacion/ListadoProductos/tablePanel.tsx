'use client'

import React, { useEffect, useState } from 'react'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'
import {
  fetchProductos,
  fetchSedesProducto,
  fetchTiposServicioProducto,
  fetchCategoriasProducto,
  Producto
} from './services/api'
import { productoTableColumns } from './columns'
import JobTableFilters from './tableFilters'
import { useDrawerContext } from '@/components/drawer/DrawerProvider'
import { ProductoDrawer } from './drawer/ProductoDrawer'

interface TipoServicio {
  nombre: string
  activo: boolean
}

export const ProductoTablePanel: React.FC = () => {
  const [rowData, setRowData] = useState<Producto[]>([])
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
    fetchProductos().then(setRowData)
  }, [])

  useEffect(() => {
    fetchSedesProducto().then(setSedes)
  }, [])

  useEffect(() => {
    fetchTiposServicioProducto().then(setTiposServicio)
  }, [])

  useEffect(() => {
    fetchCategoriasProducto().then(setCategorias)
  }, [])

  const handleRowClick = (row: Producto) => {
    openDrawer({
      id: `producto-${row.id}`,
      instanceId: `Producto-${row.id}`,
      title: `Productos`,
      width: 'half',
      isPinned: false,
      icon: null,
      contentKey: 'producto',
      contentData: row, 
      content: <ProductoDrawer data={row} /> 
    })
  }

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 py-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-x-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-light text-slate-800 tracking-wide">
          Panel de Productos
        </h1>
        <p className="text-slate-600 font-light text-sm sm:text-base">
          Listado de productos registrados y en uso
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
          columnDefs={productoTableColumns}
          rowData={rowData}
          pagination
          paginationPageSize={parseInt(showRecords)}
          breakpoint={1024}
          onRowClick={handleRowClick}
          mobileCardProps={{
            titleField: 'nombreProducto',
            collapsedFields: ['registro', 'sede'],
            hiddenFields: ['id'],
            expandedFieldOrder: [
              'registro',
              'sede',
              'materiaActiva',
              'tipoProducto',
              'estado',
              'foto'
            ]
          }}
        />

        <div className="text-sm text-gray-600 mt-4">
          Mostrando registros del 1 al {rowData.length} de un total de {rowData.length} registros
        </div>
      </div>
    </div>
  )
}
