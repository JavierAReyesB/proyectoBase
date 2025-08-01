'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Filter, RotateCcw, Search } from 'lucide-react'

interface TipoServicio {
  nombre: string
  activo: boolean
}

interface Props {
  sedes: string[]
  selectedSede: string
  setSelectedSede: (value: string) => void
  tiposServicio: TipoServicio[]
  categorias: string[]
  selectedCategoria: string
  setSelectedCategoria: (value: string) => void
  selectedTipo: string
  setSelectedTipo: (value: string) => void
  searchTerm: string
  setSearchTerm: (value: string) => void
  showRecords: string
  setShowRecords: (value: string) => void
}

const estados = ['Activo', 'Inactivo', 'Pendiente', 'Todos'] as const
type EstadoTipo = typeof estados[number]

const estadoColor: Record<EstadoTipo, string> = {
  Activo: 'bg-green-500 text-white',
  Inactivo: 'bg-gray-400 text-white',
  Pendiente: 'bg-yellow-400 text-black',
  Todos: 'bg-slate-800 text-white',
}

const JobTableFilters: React.FC<Props> = ({
  sedes,
  selectedSede,
  setSelectedSede,
  tiposServicio,
  selectedTipo,
  setSelectedTipo,
  categorias,
  selectedCategoria,
  setSelectedCategoria,
  searchTerm,
  setSearchTerm,
  showRecords,
  setShowRecords,
}) => {
  const [estado, setEstado] = useState<EstadoTipo>('Todos')

  return (
    <>
      {/* Filtros compactos */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-3">

        {/* Sede */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 font-medium">Sede:</span>
          <Select value={selectedSede} onValueChange={setSelectedSede}>
            <SelectTrigger className="w-40 h-8 text-xs border-slate-200 focus:border-slate-400">
              <SelectValue placeholder="Todas las sedes" />
            </SelectTrigger>
            <SelectContent>
              {sedes.map((sede) => (
                <SelectItem key={sede} value={sede}>
                  {sede}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Categoría */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 font-medium">Categoría:</span>
          <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
            <SelectTrigger className="w-56 h-8 text-xs border-slate-200 focus:border-slate-400">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {categorias.map((categoria) => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria.replaceAll('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo Producto */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 font-medium">Tipo Producto:</span>
          <Select value={selectedTipo} onValueChange={setSelectedTipo}>
            <SelectTrigger className="w-44 h-8 text-xs border-slate-200 focus:border-slate-400">
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {tiposServicio.map((tipo) => (
                <SelectItem key={tipo.nombre} value={tipo.nombre}>
                  {tipo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botones */}
        <div className="flex gap-2 ml-auto">
          <Button size="sm" className="bg-slate-800 hover:bg-slate-700 text-white h-8 px-3 text-xs shadow-sm">
            <Filter className="w-3 h-3 mr-1" />
            Filtrar
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50 h-8 px-3 text-xs shadow-sm bg-transparent"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Limpiar
          </Button>
        </div>
      </div>

      {/* Estado */}
      <div className="flex flex-col md:flex-row gap-4 border-y py-3 mb-3 text-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="font-medium text-slate-700">Estado</span>
          <div className="flex flex-wrap gap-2">
            {estados.map((item) => (
              <Button
                key={item}
                onClick={() => setEstado(item)}
                size="sm"
                className={`h-7 px-3 text-xs shadow-sm ${estado === item ? estadoColor[item] : 'bg-slate-100 text-slate-600'}`}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Mostrar y Buscar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">

        {/* Mostrar */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 font-medium">Mostrar</span>
          <Select value={showRecords} onValueChange={setShowRecords}>
            <SelectTrigger className="w-16 h-8 text-xs border-slate-200 focus:border-slate-400">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-slate-600">registros</span>
        </div>

        {/* Buscar */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 font-medium">Buscar:</span>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 h-3 w-3" />
            <Input
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 w-64 h-8 text-xs border-slate-200 focus:border-slate-400"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default JobTableFilters
