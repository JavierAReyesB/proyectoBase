'use client'

import React, { useEffect, useState } from 'react'
import { CalendarIcon, HelpCircle } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

import { DashboardCard, type CardData } from './DashboardCard'
import { DashboardSection } from './DashboardSection'
import { fetchDashboardCards } from './services/dashboard'

export default function CuadroMandoPanel() {
  const [sede, setSede] = useState('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [cards, setCards] = useState<CardData[]>([])

  useEffect(() => {
    // Fetch inicial
    fetchDashboardCards().then(setCards).catch((err) => {
      console.error('Error cargando los datos del cuadro de mando:', err)
    })
  }, [])

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 py-6">

      {/* Breadcrumb y ayuda */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Inicio / Mi cuadro de mando</p>
        <Button variant="default" className="gap-2">
          <HelpCircle size={16} />
          AYUDA AL USUARIO
        </Button>
      </div>

      <DashboardSection title="Cuadro de Mando">
        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sede */}
          <div className="col-span-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Sede</label>
            <Select value={sede} onValueChange={setSede}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionados 1061 de 1061" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="centro1">Centro 1</SelectItem>
                <SelectItem value="centro2">Centro 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Desde Fecha */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Desde Fecha</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                type="date"
                className="pl-10"
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
              />
            </div>
          </div>

          {/* Hasta Fecha */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Hasta Fecha</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                type="date"
                className="pl-10"
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-end gap-2">
            <Button className="w-full">Filtrar</Button>
            <Button
              variant="outline"
              className="w-full bg-yellow-400 text-black hover:bg-yellow-300"
              onClick={() => {
                setSede('')
                setDesde('')
                setHasta('')
              }}
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>

        {/* Grilla de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
          {cards.map((card) => (
            <DashboardCard key={card.id} data={card} size="xl" />
          ))}
        </div>
      </DashboardSection>
    </div>
  )
}
