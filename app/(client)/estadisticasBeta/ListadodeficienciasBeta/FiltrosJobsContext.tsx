'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface FiltrosJobsState {
  selectedSede: string
  setSelectedSede: (v: string) => void
  selectedTipo: string
  setSelectedTipo: (v: string) => void
  searchTerm: string
  setSearchTerm: (v: string) => void
  showRecords: string
  setShowRecords: (v: string) => void
}

const FiltrosJobsContext = createContext<FiltrosJobsState | undefined>(undefined)

export const FiltrosJobsProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSede, setSelectedSede] = useState('todas')
  const [selectedTipo, setSelectedTipo] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [showRecords, setShowRecords] = useState('10')

  return (
    <FiltrosJobsContext.Provider
      value={{
        selectedSede,
        setSelectedSede,
        selectedTipo,
        setSelectedTipo,
        searchTerm,
        setSearchTerm,
        showRecords,
        setShowRecords,
      }}
    >
      {children}
    </FiltrosJobsContext.Provider>
  )
}

export const useFiltrosJobs = () => {
  const ctx = useContext(FiltrosJobsContext)
  if (!ctx) throw new Error('useFiltrosJobs must be used within FiltrosJobsProvider')
  return ctx
}
