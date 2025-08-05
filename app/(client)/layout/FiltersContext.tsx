import React, { createContext, useContext, useState, ReactNode } from 'react'

interface FiltersState {
  selectedSede: string
  setSelectedSede: (v: string) => void
  selectedTipo: string
  setSelectedTipo: (v: string) => void
  searchTerm: string
  setSearchTerm: (v: string) => void
  showRecords: string
  setShowRecords: (v: string) => void
}

const FiltersContext = createContext<FiltersState | undefined>(undefined)

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSede, setSelectedSede] = useState<string>('')        
  const [selectedTipo, setSelectedTipo] = useState<string>('todos')   
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showRecords, setShowRecords] = useState<string>('10')

  return (
    <FiltersContext.Provider
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
    </FiltersContext.Provider>
  )
}

export const useFilters = () => {
  const ctx = useContext(FiltersContext)
  if (!ctx) throw new Error('useFilters must be used within FiltersProvider')
  return ctx
}
