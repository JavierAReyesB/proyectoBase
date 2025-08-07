'use client'

import { useMemo } from 'react'

type Item = Record<string, any>

interface UseFiltroTablaProps<T extends Item> {
  data: T[]
  selectedSede: string
  selectedTipo: string
  selectedCategoria?: string
  searchTerm: string
  sedeKey?: keyof T
  tipoKey?: keyof T
  categoriaKey?: keyof T
  searchKeys?: (keyof T)[]
}

export function useFiltroTabla<T extends Item>({
  data,
  selectedSede,
  selectedTipo,
  selectedCategoria = 'todas',
  searchTerm,
  sedeKey = 'sede',
  tipoKey = 'servicio',
  categoriaKey = 'tipoTrabajo',
  searchKeys = ['cliente', 'descripcion'],
}: UseFiltroTablaProps<T>) {
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const categoriaFilter = selectedCategoria.trim().toLowerCase()

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const sedeItem      = String(item[sedeKey] ?? '').trim().toLowerCase()
      const tipoItem      = String(item[tipoKey] ?? '').trim().toLowerCase()
      const categoriaItem = String(item[categoriaKey] ?? '').trim().toLowerCase()

      const sedeFilter = selectedSede.trim().toLowerCase()
      const tipoFilter = selectedTipo.trim().toLowerCase()

      const matchSede =
        sedeFilter === '' || sedeFilter === 'todas' || sedeItem === sedeFilter

      const matchTipo =
        tipoFilter === '' || tipoFilter === 'todos' || tipoItem === tipoFilter

      const matchCategoria =
        categoriaFilter === '' || categoriaFilter === 'todas' || categoriaItem === categoriaFilter

      const matchSearch =
        normalizedSearch === '' ||
        searchKeys.some((key) =>
          String(item[key] ?? '').toLowerCase().includes(normalizedSearch)
        )

      return matchSede && matchTipo && matchCategoria && matchSearch
    })
  }, [
    data,
    selectedSede,
    selectedTipo,
    selectedCategoria,
    normalizedSearch,
    sedeKey,
    tipoKey,
    categoriaKey,
    searchKeys
  ])

  return filteredData
}
