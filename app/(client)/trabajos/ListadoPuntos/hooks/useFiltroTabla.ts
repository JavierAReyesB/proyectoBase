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
  tipoKey = 'tipoTrabajo',
  searchKeys = ['operario', 'recomendaciones'],
}: UseFiltroTablaProps<T>) {
  const search = searchTerm.trim().toLowerCase()

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSede =
        selectedSede === '' || selectedSede === 'todas' || item[sedeKey] === selectedSede

      const matchTipo =
        selectedTipo === '' || selectedTipo === 'todos' || item[tipoKey] === selectedTipo

      const matchSearch =
        search === '' ||
        searchKeys.some((key) =>
          String(item[key] ?? '').toLowerCase().includes(search)
        )

      return matchSede && matchTipo && matchSearch
    })
  }, [data, selectedSede, selectedTipo, search, sedeKey, tipoKey, searchKeys])

  return filteredData
}
