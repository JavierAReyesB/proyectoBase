'use client'

import { useMemo } from 'react'

type Item = Record<string, any>

interface UseFiltroTablaProps<T extends Item> {
  data: T[]
  selectedSede: string
  selectedTipo: string
  searchTerm: string
  sedeKey?: keyof T
  tipoKey?: keyof T
  searchKeys?: (keyof T)[]
}

export function useFiltroTabla<T extends Item>({
  data,
  selectedSede,
  selectedTipo,
  searchTerm,
  sedeKey = 'sede',           
  tipoKey = 'servicio',           
  searchKeys = ['cliente', 'descripcion'],
}: UseFiltroTablaProps<T>) {
  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const sedeItem      = String(item[sedeKey]   ?? '').trim().toLowerCase()
      const tipoItem      = String(item[tipoKey]   ?? '').trim().toLowerCase()
      const sedeFilter    = selectedSede.trim().toLowerCase()
      const tipoFilter    = selectedTipo.trim().toLowerCase()

      const matchSede =
        sedeFilter === '' ||
        sedeFilter === 'todas' ||
        sedeItem === sedeFilter

      const matchTipo =
        tipoFilter === '' ||
        tipoFilter === 'todos' ||
        tipoItem === tipoFilter

      const matchSearch =
        normalizedSearch === '' ||
        searchKeys.some((key) =>
          String(item[key] ?? '').toLowerCase().includes(normalizedSearch)
        )

      return matchSede && matchTipo && matchSearch
    })
  }, [data, selectedSede, selectedTipo, normalizedSearch, sedeKey, tipoKey, searchKeys])

  return filteredData
}
