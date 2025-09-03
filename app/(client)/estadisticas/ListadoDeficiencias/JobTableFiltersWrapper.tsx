'use client'

import React, { useEffect, useState } from 'react'
import JobTableFilters from './JobTableFilters'
import { fetchTrabajos, Trabajo } from './services/api'
import { useFiltrosJobs } from './FiltrosJobsContext'

export const JobTableFiltersWrapper: React.FC = () => {
  const {
    selectedSede,
    setSelectedSede,
    selectedTipo,
    setSelectedTipo,
    searchTerm,
    setSearchTerm,
    showRecords,
    setShowRecords,
  } = useFiltrosJobs()

  const [sedes, setSedes] = useState<string[]>([])
  const [servicios, setServicios] = useState<string[]>([])  

  useEffect(() => {
    fetchTrabajos().then((trabajos: Trabajo[]) => {

      const sedesUnicas = Array.from(new Set(trabajos.map((t) => t.sede))).sort()
      setSedes(sedesUnicas)


      const serviciosUnicos = Array.from(new Set(trabajos.map((t) => t.servicio))).sort()
      setServicios(serviciosUnicos)
    })
  }, [])

  return (
    <JobTableFilters
      sedes={sedes}
      selectedSede={selectedSede}
      setSelectedSede={setSelectedSede}
      servicios={servicios}                 
      selectedTipo={selectedTipo}
      setSelectedTipo={setSelectedTipo}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      showRecords={showRecords}
      setShowRecords={setShowRecords}
    />
  )
}

export default JobTableFiltersWrapper
