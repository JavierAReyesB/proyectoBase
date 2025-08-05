'use client'

import React, { useEffect, useState } from 'react'
import PuntosTableFilters from './tableFilters'
import { fetchPuntos, fetchTiposPunto, Punto } from './services/api'
import { useFilters } from '../../layout/FiltersContext'   

interface TipoPunto {
  nombre: string
  activo: boolean
}

export const PuntosTableFiltersWrapper: React.FC = () => {

  const {
    selectedSede,
    setSelectedSede,
    selectedTipo,
    setSelectedTipo,
    searchTerm,
    setSearchTerm,
    showRecords,
    setShowRecords,
  } = useFilters()

  const [sedes, setSedes] = useState<string[]>([])
  const [tiposPunto, setTiposPunto] = useState<TipoPunto[]>([])

  useEffect(() => {

    fetchPuntos().then((puntos: Punto[]) => {
      const sedesUnicas = Array.from(new Set(puntos.map((p) => p.sede))).sort()
      setSedes(sedesUnicas)
    })

    fetchTiposPunto().then(setTiposPunto)
  }, [])

  return (
    <PuntosTableFilters
      sedes={sedes}
      selectedSede={selectedSede}
      setSelectedSede={setSelectedSede}
      tiposPunto={tiposPunto}
      selectedTipo={selectedTipo}
      setSelectedTipo={setSelectedTipo}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      showRecords={showRecords}
      setShowRecords={setShowRecords}
    />
  )
}

export default PuntosTableFiltersWrapper
