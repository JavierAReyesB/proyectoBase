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
import { Filter, RotateCcw, Search, Calendar } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

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
  categorias: string[]
  selectedCategoria: string
  setSelectedCategoria: (value: string) => void
  estados: string[]
  selectedEstado: string
  setSelectedEstado: (value: string) => void
  criticidades: string[]
  selectedCriticidad: string
  setSelectedCriticidad: (value: string) => void
  searchTerm: string
  setSearchTerm: (value: string) => void
}

const estadoColor: Record<string, string> = {
  Pendiente: 'bg-red-500 text-white',
  'En Proceso': 'bg-yellow-400 text-black',
  Cerrado: 'bg-green-500 text-white',
  Todos: 'bg-gray-800 text-white',
}

const criticidadColor: Record<string, string> = {
  'Muy Urgente': 'bg-red-100 text-red-600 border border-red-400',
  Urgente: 'bg-yellow-100 text-yellow-700 border border-yellow-400',
  Normal: 'bg-white text-slate-700 border border-slate-300',
  Todos: 'bg-gray-800 text-white',
}

const DeficienciasTableFilters: React.FC<Props> = ({
  sedes = [],
  selectedSede,
  setSelectedSede,
  tiposServicio = [],
  selectedTipo,
  setSelectedTipo,
  categorias = [],
  selectedCategoria,
  setSelectedCategoria,
  estados = [],
  selectedEstado,
  setSelectedEstado,
  criticidades = [],
  selectedCriticidad,
  setSelectedCriticidad,
  searchTerm,
  setSearchTerm,
}) => {
  const handleClearFilters = () => {
    setSelectedSede('todas')
    setSelectedTipo('todos')
    setSelectedCategoria('todas')
    setSelectedEstado('todos')
    setSelectedCriticidad('todos')
    setSearchTerm('')
  }

  const handleApplyFilters = () => {
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-white h-full px-4 pt-6 pb-20 space-y-6">

      <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>

      {/* Sede */}
      <div className="space-y-2">
        <Label htmlFor="sede">Sede</Label>
        <Select value={selectedSede} onValueChange={setSelectedSede}>
          <SelectTrigger id="sede" className="w-full">
            <SelectValue placeholder="Todas las sedes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las sedes</SelectItem>
            {sedes.map((sede) => (
              <SelectItem key={sede} value={sede}>
                {sede}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Categoría */}
      <div className="space-y-2">
        <Label htmlFor="categoria">Categoría</Label>
        <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
          <SelectTrigger id="categoria" className="w-full">
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

      <Separator />

      {/* Período */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <Label className="text-sm font-medium text-gray-700">Período</Label>
        </div>
        <div className="space-y-2">
          <div>
            <Label htmlFor="desde" className="text-xs text-gray-600">
              Desde
            </Label>
            <Input id="desde" type="date" className="w-full text-sm" />
          </div>
          <div>
            <Label htmlFor="hasta" className="text-xs text-gray-600">
              Hasta
            </Label>
            <Input id="hasta" type="date" className="w-full text-sm" />
          </div>
        </div>
      </div>

      <Separator />

      {/* Tipo de Servicio */}
      <div className="space-y-2">
        <Label htmlFor="servicio">Tipo de Servicio</Label>
        <Select value={selectedTipo} onValueChange={setSelectedTipo}>
          <SelectTrigger id="servicio" className="w-full">
            <SelectValue placeholder="Todos los servicios" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {tiposServicio.map((srv) => (
              <SelectItem key={srv.nombre} value={srv.nombre}>
                {srv.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Buscar */}
      <div className="space-y-2">
        <Label htmlFor="buscar">Buscar</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="buscar"
            type="text"
            placeholder="Buscar en registros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full text-sm"
          />
        </div>
      </div>

      <Separator />

      {/* Estados */}
      {/* <div className="space-y-2">
        <Label className="text-sm">Estados</Label>
        <div className="flex flex-wrap gap-2">
          {estados.map((estado) => (
            <Badge
              key={`estado-${estado}`}
              className={`cursor-pointer ${estadoColor[estado] || 'bg-slate-100 text-slate-600'}`}
              onClick={() => setSelectedEstado(estado)}
            >
              {estado}
            </Badge>
          ))}
        </div>
      </div> */}
      <div className="space-y-2">
        <Label className="text-sm">Estados</Label>
        <div className="flex flex-wrap gap-2">
          <Badge className="cursor-pointer bg-red-500 text-white">Pendiente</Badge>
          <Badge className="cursor-pointer bg-yellow-400 text-black">En Proceso</Badge>
          <Badge className="cursor-pointer bg-green-500 text-white">Cerrado</Badge>
          <Badge className="cursor-pointer bg-gray-800 text-white">Todos</Badge>
        </div>
      </div>

      {/* Criticidad */}
      {/* <div className="space-y-2">
        <Label className="text-sm">Criticidad</Label>
        <div className="flex flex-wrap gap-2">
          {criticidades.map((criticidad) => (
            <Badge
              key={`criticidad-${criticidad}`}
              className={`cursor-pointer ${criticidadColor[criticidad] || 'bg-slate-100 text-slate-600'}`}
              onClick={() => setSelectedCriticidad(criticidad)}
            >
              {criticidad}
            </Badge>
          ))}
        </div>
      </div> */}
      <div className="space-y-2">
        <Label className="text-sm">Criticidad</Label>
        <div className="flex flex-wrap gap-2">
          <Badge className="cursor-pointer bg-red-100 text-red-600 border border-red-400">Muy Urgente</Badge>
          <Badge className="cursor-pointer bg-yellow-100 text-yellow-700 border border-yellow-400">Urgente</Badge>
          <Badge className="cursor-pointer bg-white text-slate-700 border border-slate-300">Normal</Badge>
          <Badge className="cursor-pointer bg-gray-800 text-white">Todos</Badge>
        </div>
      </div>

      {/* Botones */}
      <div className="pt-4 flex gap-2">
        <Button className="w-full" onClick={handleApplyFilters}>
          <Filter className="w-4 h-4 mr-2" />
          Filtrar
        </Button>
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={handleClearFilters}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Limpiar Filtros
        </Button>
      </div>
    </div>
  )
}

export default DeficienciasTableFilters
