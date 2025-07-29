'use client'

import React from 'react'
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
  selectedTipo: string
  setSelectedTipo: (value: string) => void
  searchTerm: string
  setSearchTerm: (value: string) => void
  showRecords: string
  setShowRecords: (value: string) => void
}

const JobTableFilters: React.FC<Props> = ({
  sedes,
  selectedSede,
  setSelectedSede,
  tiposServicio,
  selectedTipo,
  setSelectedTipo,
  searchTerm,
  setSearchTerm,
  showRecords,
  setShowRecords,
}) => {
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

        {/* Desde */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 font-medium">Desde:</span>
          <Input type="date" className="w-32 h-8 text-xs border-slate-200 focus:border-slate-400" />
        </div>

        {/* Hasta */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 font-medium">Hasta:</span>
          <Input type="date" className="w-32 h-8 text-xs border-slate-200 focus:border-slate-400" />
        </div>

        {/* Tipo Servicio */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 font-medium">Tipo de Servicio:</span>
          <Select value={selectedTipo} onValueChange={setSelectedTipo}>
            <SelectTrigger className="w-44 h-8 text-xs border-slate-200 focus:border-slate-400">
              <SelectValue placeholder="Todos los servicios" />
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
            Limpiar Filtros
          </Button>
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
              placeholder="Buscar en registros..."
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
