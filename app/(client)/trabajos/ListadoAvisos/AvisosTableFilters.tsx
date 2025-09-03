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

interface TipoAviso {
  nombre: string
  activo: boolean
}

interface Props {
  sedes: string[]
  tiposAviso: TipoAviso[]
  selectedSede: string
  setSelectedSede: (v: string) => void
  selectedTipo: string
  setSelectedTipo: (v: string) => void
  searchTerm: string
  setSearchTerm: (v: string) => void
  showRecords: string
  setShowRecords: (v: string) => void
}

const AvisosTableFilters: React.FC<Props> = ({
  sedes,
  tiposAviso,
  selectedSede,
  setSelectedSede,
  selectedTipo,
  setSelectedTipo,
  searchTerm,
  setSearchTerm,
  showRecords,
  setShowRecords,
}) => {
  const handleClearFilters = () => {
    setSelectedSede('todas')
    setSelectedTipo('todos')
    setSearchTerm('')
    setShowRecords('10')
  }

  const handleApplyFilters = () => {
    // Si más adelante quieres disparar una búsqueda al backend, hazlo aquí.
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-white h-full px-4 py-6 space-y-6">
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

      {/* Período (mismo placeholder que en Jobs) */}
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

      {/* Tipo de aviso */}
      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo</Label>
        <Select value={selectedTipo} onValueChange={setSelectedTipo}>
          <SelectTrigger id="tipo" className="w-full">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {tiposAviso.map((t) => (
              <SelectItem key={t.nombre} value={t.nombre}>
                {t.nombre}
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
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

      {/* Mostrar */}
      <div className="space-y-2">
        <Label htmlFor="mostrar">Mostrar registros</Label>
        <Select value={showRecords} onValueChange={setShowRecords}>
          <SelectTrigger id="mostrar" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 registros</SelectItem>
            <SelectItem value="25">25 registros</SelectItem>
            <SelectItem value="50">50 registros</SelectItem>
            <SelectItem value="100">100 registros</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Botones */}
      <div className="pt-4 space-y-2">
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

export default AvisosTableFilters
