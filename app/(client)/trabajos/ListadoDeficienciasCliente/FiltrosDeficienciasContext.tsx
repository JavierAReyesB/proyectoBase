'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface FiltrosDeficienciasState {
  selectedSede: string
  setSelectedSede: (v: string) => void
  selectedTipo: string
  setSelectedTipo: (v: string) => void
  selectedCategoria: string
  setSelectedCategoria: (v: string) => void
  selectedEstado: string
  setSelectedEstado: (v: string) => void
  selectedCriticidad: string
  setSelectedCriticidad: (v: string) => void
  searchTerm: string
  setSearchTerm: (v: string) => void
  showRecords: string
  setShowRecords: (v: string) => void
}

const FiltrosDeficienciasContext = createContext<FiltrosDeficienciasState | undefined>(undefined)

export const FiltrosDeficienciasProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSede, setSelectedSede] = useState('todas')
  const [selectedTipo, setSelectedTipo] = useState('todos')
  const [selectedCategoria, setSelectedCategoria] = useState('todas')
  const [selectedEstado, setSelectedEstado] = useState('todos')
  const [selectedCriticidad, setSelectedCriticidad] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [showRecords, setShowRecords] = useState('10')

  return (
    <FiltrosDeficienciasContext.Provider
      value={{
        selectedSede,
        setSelectedSede,
        selectedTipo,
        setSelectedTipo,
        selectedCategoria,
        setSelectedCategoria,
        selectedEstado,
        setSelectedEstado,
        selectedCriticidad,
        setSelectedCriticidad,
        searchTerm,
        setSearchTerm,
        showRecords,
        setShowRecords
      }}
    >
      {children}
    </FiltrosDeficienciasContext.Provider>
  )
}

export const useFiltrosDeficiencias = () => {
  const ctx = useContext(FiltrosDeficienciasContext)
  if (!ctx) throw new Error('useFiltrosDeficiencias must be used within FiltrosDeficienciasProvider')
  return ctx
}
