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

interface TipoPunto {
  nombre: string
  activo: boolean
}

interface Props {
  sedes: string[]
  selectedSede: string
  setSelectedSede: (value: string) => void
  tiposPunto: TipoPunto[]
  selectedTipo: string
  setSelectedTipo: (value: string) => void
  searchTerm: string
  setSearchTerm: (value: string) => void
  showRecords: string
  setShowRecords: (value: string) => void
}

const estados = ['Pendiente', 'En Proceso', 'Cerrado', 'Todos'] as const
type EstadoTipo = typeof estados[number]

const prioridades = ['Alta', 'Media', 'Baja', 'Todos'] as const
type PrioridadTipo = typeof prioridades[number]

const estadoColor: Record<EstadoTipo, string> = {
  Pendiente: 'bg-red-500 text-white',
  'En Proceso': 'bg-yellow-400 text-black',
  Cerrado: 'bg-green-500 text-white',
  Todos: 'bg-gray-800 text-white',
}

const prioridadColor: Record<PrioridadTipo, string> = {
  Alta: 'bg-red-100 text-red-600 border border-red-400',
  Media: 'bg-yellow-100 text-yellow-700 border border-yellow-400',
  Baja: 'bg-white text-slate-700 border border-slate-300',
  Todos: 'bg-gray-800 text-white',
}

const PuntosTableFilters: React.FC<Props> = ({
  sedes,
  selectedSede,
  setSelectedSede,
  tiposPunto,
  selectedTipo,
  setSelectedTipo,
  searchTerm,
  setSearchTerm,
  showRecords,
  setShowRecords,
}) => {
  const [estado, setEstado] = useState<EstadoTipo>('Todos')
  const [prioridad, setPrioridad] = useState<PrioridadTipo>('Todos')

  return (
    <>
      {/* Filtros compactos */}
      <div className="flex flex-wrap gap-3 mb-2 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 font-medium">Sede:</span>
          <Select value={selectedSede} onValueChange={setSelectedSede}>
            <SelectTrigger className="w-40 h-8 text-xs border-slate-200">
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

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 font-medium">Desde:</span>
          <Input type="date" className="w-32 h-8 text-xs border-slate-200" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 font-medium">Hasta:</span>
          <Input type="date" className="w-32 h-8 text-xs border-slate-200" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 font-medium">Tipo:</span>
          <Select value={selectedTipo} onValueChange={setSelectedTipo}>
            <SelectTrigger className="w-44 h-8 text-xs border-slate-200">
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {tiposPunto.map((tipo) => (
                <SelectItem key={tipo.nombre} value={tipo.nombre}>
                  {tipo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 ml-auto">
          <Button size="sm" className="bg-slate-800 hover:bg-slate-700 text-white h-8 px-3 text-xs">
            <Filter className="w-3 h-3 mr-1" />
            Filtrar
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50 h-8 px-3 text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Limpiar Filtros
          </Button>
        </div>
      </div>

      {/* Estado y Prioridad */}
      <div className="flex flex-wrap md:flex-nowrap gap-4 border-y py-2 mb-2 text-sm">
        {/* <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-slate-700">Estados</span>
          {estados.map((item) => (
            <Button
              key={item}
              onClick={() => setEstado(item)}
              size="sm"
              className={`h-7 px-3 text-xs ${
                estado === item ? estadoColor[item] : 'bg-slate-100 text-slate-600'
              }`}
            >
              {item}
            </Button>
          ))}
        </div> */}

        {/* Descomenta si necesitas habilitar prioridad */}
        {/* <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-slate-700">Prioridad</span>
          {prioridades.map((item) => (
            <Button
              key={item}
              onClick={() => setPrioridad(item)}
              size="sm"
              className={`h-7 px-3 text-xs ${
                prioridad === item ? prioridadColor[item] : 'bg-slate-100 text-slate-600'
              }`}
            >
              {item}
            </Button>
          ))}
        </div> */}
      </div>

      {/* Mostrar y Buscar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 font-medium">Mostrar</span>
          <Select value={showRecords} onValueChange={setShowRecords}>
            <SelectTrigger className="w-16 h-8 text-xs border-slate-200">
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

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 font-medium">Buscar:</span>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 h-3 w-3" />
            <Input
              placeholder="Buscar en registros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 w-64 h-8 text-xs border-slate-200"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default PuntosTableFilters
