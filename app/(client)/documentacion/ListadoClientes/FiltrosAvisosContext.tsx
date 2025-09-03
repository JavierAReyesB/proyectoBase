'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export const estados = ['Pendiente', 'En Proceso', 'Cerrado', 'Todos'] as const
export type EstadoTipo = typeof estados[number]

export const prioridades = ['Alta', 'Media', 'Baja', 'Todos'] as const
export type PrioridadTipo = typeof prioridades[number]

export interface TipoAviso {
  nombre: string
  activo: boolean
}

interface FiltrosAvisosState {
  // Sede / Tipo / Búsqueda / Paginación
  selectedSede: string
  setSelectedSede: (v: string) => void
  selectedTipo: string
  setSelectedTipo: (v: string) => void
  searchTerm: string
  setSearchTerm: (v: string) => void
  showRecords: string
  setShowRecords: (v: string) => void

  // Estado y Prioridad
  estado: EstadoTipo
  setEstado: (v: EstadoTipo) => void
  prioridad: PrioridadTipo
  setPrioridad: (v: PrioridadTipo) => void

  // Rango de fechas (YYYY-MM-DD)
  desde: string
  setDesde: (v: string) => void
  hasta: string
  setHasta: (v: string) => void

  // Utils
  clearAll: () => void
}

const FiltrosAvisosContext = createContext<FiltrosAvisosState | undefined>(undefined)

export const FiltrosAvisosProvider = ({ children }: { children: ReactNode }) => {
  // Valores por defecto
  const [selectedSede, setSelectedSede] = useState<string>('todas')
  const [selectedTipo, setSelectedTipo] = useState<string>('todos')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showRecords, setShowRecords] = useState<string>('10')

  const [estado, setEstado] = useState<EstadoTipo>('Todos')
  const [prioridad, setPrioridad] = useState<PrioridadTipo>('Todos')

  const [desde, setDesde] = useState<string>('') // formato YYYY-MM-DD
  const [hasta, setHasta] = useState<string>('') // formato YYYY-MM-DD

  const clearAll = () => {
    setSelectedSede('todas')
    setSelectedTipo('todos')
    setSearchTerm('')
    setShowRecords('10')
    setEstado('Todos')
    setPrioridad('Todos')
    setDesde('')
    setHasta('')
  }

  return (
    <FiltrosAvisosContext.Provider
      value={{
        selectedSede,
        setSelectedSede,
        selectedTipo,
        setSelectedTipo,
        searchTerm,
        setSearchTerm,
        showRecords,
        setShowRecords,
        estado,
        setEstado,
        prioridad,
        setPrioridad,
        desde,
        setDesde,
        hasta,
        setHasta,
        clearAll,
      }}
    >
      {children}
    </FiltrosAvisosContext.Provider>
  )
}

export const useFiltrosAvisos = () => {
  const ctx = useContext(FiltrosAvisosContext)
  if (!ctx) throw new Error('useFiltrosAvisos must be used within FiltrosAvisosProvider')
  return ctx
}
