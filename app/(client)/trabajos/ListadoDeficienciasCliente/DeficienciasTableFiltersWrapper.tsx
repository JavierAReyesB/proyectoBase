'use client'

import React, { useEffect, useState } from 'react'
import TableFilters from './tablefilters'
import {
  fetchDeficiencias,
  Deficiencia,
  fetchCategoriasDef,
} from './services/api'
import { useFiltrosDeficiencias } from './FiltrosDeficienciasContext'

interface TipoServicio {
  nombre: string
  activo: boolean
}

export const DeficienciasTableFiltersWrapper: React.FC = () => {
  const {
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
    setSearchTerm
  } = useFiltrosDeficiencias()

  const [sedes, setSedes] = useState<string[]>([])
  const [servicios, setServicios] = useState<TipoServicio[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [estados, setEstados] = useState<string[]>([])
  const [criticidades, setCriticidades] = useState<string[]>([])

  useEffect(() => {
    fetchDeficiencias().then((deficiencias: Deficiencia[]) => {
      const sedesUnicas = Array.from(new Set(deficiencias.map((d) => d.sede))).sort()
      const serviciosUnicos: TipoServicio[] = Array.from(
        new Set(deficiencias.map((d) => d.servicio))
      )
        .sort()
        .map((nombre) => ({
          nombre,
          activo: true
        }))

      const estadosUnicos = Array.from(new Set(deficiencias.map((d) => d.estado))).sort()
      const criticidadesUnicas = Array.from(new Set(deficiencias.map((d) => d.criticidad))).sort()

      setSedes(sedesUnicas)
      setServicios(serviciosUnicos)
      setEstados(['todos', ...estadosUnicos])
      setCriticidades(['todos', ...criticidadesUnicas])
    })

    fetchCategoriasDef().then((cats) => {
      setCategorias(['todas', ...cats.sort()])
    })
  }, [])

  return (
    <TableFilters
      sedes={sedes}
      selectedSede={selectedSede}
      setSelectedSede={setSelectedSede}
      tiposServicio={servicios}
      selectedTipo={selectedTipo}
      setSelectedTipo={setSelectedTipo}
      categorias={categorias}
      selectedCategoria={selectedCategoria}
      setSelectedCategoria={setSelectedCategoria}
      estados={estados}
      selectedEstado={selectedEstado}
      setSelectedEstado={setSelectedEstado}
      criticidades={criticidades}
      selectedCriticidad={selectedCriticidad}
      setSelectedCriticidad={setSelectedCriticidad}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  )
}

export default DeficienciasTableFiltersWrapper
