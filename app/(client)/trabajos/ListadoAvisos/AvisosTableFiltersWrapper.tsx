'use client'

import React, { useEffect, useState } from 'react'
import AvisosTableFilters from './AvisosTableFilters'
import { fetchAvisos, type Aviso } from './services/api'
import { useFiltrosAvisos } from './FiltrosAvisosContext' // ← ajusta la ruta si es necesario

interface TipoAviso {
  nombre: string
  activo: boolean
}

export const AvisosTableFiltersWrapper: React.FC = () => {
  const {
    selectedSede,
    setSelectedSede,
    selectedTipo,
    setSelectedTipo,
    searchTerm,
    setSearchTerm,
    showRecords,
    setShowRecords,
  } = useFiltrosAvisos()

  const [sedes, setSedes] = useState<string[]>([])
  const [tiposAviso, setTiposAviso] = useState<TipoAviso[]>([])

  useEffect(() => {
    fetchAvisos().then((avisos: Aviso[]) => {
      // Sedes únicas
      const sedesUnicas = Array.from(
        new Set(avisos.map((a) => String(a.sede ?? '').trim()).filter(Boolean))
      ).sort()
      setSedes(sedesUnicas)

      // Tipos únicos (intenta 'tipoAviso' y si no, cae a 'tipo' o 'servicio')
      const nombresTipos = Array.from(
        new Set(
          avisos
            .map((a) =>
              String((a as any).tipoAviso ?? (a as any).tipo ?? (a as any).servicio ?? '')
                .trim()
            )
            .filter(Boolean)
        )
      ).sort()

      const tipos: TipoAviso[] = nombresTipos.map((nombre) => ({ nombre, activo: true }))
      setTiposAviso(tipos)
    })
  }, [])

  return (
    <AvisosTableFilters
      sedes={sedes}
      tiposAviso={tiposAviso}
      selectedSede={selectedSede}
      setSelectedSede={setSelectedSede}
      selectedTipo={selectedTipo}
      setSelectedTipo={setSelectedTipo}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      showRecords={showRecords}
      setShowRecords={setShowRecords}
    />
  )
}

export default AvisosTableFiltersWrapper
