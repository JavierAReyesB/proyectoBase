'use client'

import { useMemo } from 'react'

type Item = Record<string, any>

export interface UseFiltroTablaAvisosProps<T extends Item> {
  data: T[]
  // filtros básicos
  selectedSede: string
  selectedTipo: string
  searchTerm: string

  // filtros adicionales (opcionales)
  estado?: string            // 'Pendiente' | 'En Proceso' | 'Cerrado' | 'Todos'
  prioridad?: string         // 'Alta' | 'Media' | 'Baja' | 'Todos'
  desde?: string             // 'YYYY-MM-DD'
  hasta?: string             // 'YYYY-MM-DD'

  // mapeo de claves (ajusta a tu modelo real)
  sedeKey?: keyof T          // por defecto 'sede'
  tipoKey?: keyof T          // por defecto 'tipo' (o 'tipoAviso')
  estadoKey?: keyof T        // por defecto 'estado'
  prioridadKey?: keyof T     // por defecto 'prioridad'
  dateKey?: keyof T          // por defecto 'fecha' (ISO/epoch/Date admitidos)

  // búsqueda libre
  searchKeys?: (keyof T)[]   // por defecto ['id','descripcion']
}

function parseFlexibleDate(value: unknown): Date | null {
  if (!value && value !== 0) return null

  // Date instancia
  if (value instanceof Date && !isNaN(value.getTime())) return value

  // number epoch (ms o s)
  if (typeof value === 'number') {
    const ms = value > 1e12 ? value : value * 1000
    const d = new Date(ms)
    return isNaN(d.getTime()) ? null : d
  }

  // string común (ISO / YYYY-MM-DD / DD/MM/YYYY)
  if (typeof value === 'string') {
    const s = value.trim()
    // DD/MM/YYYY
    const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (m) {
      const [, dd, mm, yyyy] = m
      const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd))
      return isNaN(d.getTime()) ? null : d
    }
    // ISO o YYYY-MM-DD
    const d = new Date(s)
    return isNaN(d.getTime()) ? null : d
  }

  return null
}

export function useFiltroTablaAvisos<T extends Item>({
  data,
  selectedSede,
  selectedTipo,
  searchTerm,
  estado,
  prioridad,
  desde,
  hasta,
  sedeKey = 'sede' as keyof T,
  tipoKey = 'tipo' as keyof T,          // cambia a 'tipoAviso' si así se llama en tu modelo
  estadoKey = 'estado' as keyof T,
  prioridadKey = 'prioridad' as keyof T,
  dateKey = 'fecha' as keyof T,         // cambia a 'fechaCreacion' / 'createdAt' si corresponde
  searchKeys = ['id', 'descripcion'] as (keyof T)[],
}: UseFiltroTablaAvisosProps<T>) {
  const normalizedSearch = (searchTerm ?? '').trim().toLowerCase()
  const sedeFilter = (selectedSede ?? '').trim().toLowerCase()
  const tipoFilter = (selectedTipo ?? '').trim().toLowerCase()
  const estadoFilter = (estado ?? 'Todos').trim().toLowerCase()
  const prioridadFilter = (prioridad ?? 'Todos').trim().toLowerCase()

  // Normalizamos fechas de filtro (desde = 00:00, hasta = 23:59:59.999)
  const startDate = useMemo(() => {
    if (!desde) return null
    const d = parseFlexibleDate(desde)
    if (!d) return null
    d.setHours(0, 0, 0, 0)
    return d
  }, [desde])

  const endDate = useMemo(() => {
    if (!hasta) return null
    const d = parseFlexibleDate(hasta)
    if (!d) return null
    d.setHours(23, 59, 59, 999)
    return d
  }, [hasta])

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // ----- Sede / Tipo -----
      const sedeItem = String(item[sedeKey] ?? '').trim().toLowerCase()
      const tipoItem = String(item[tipoKey] ?? '').trim().toLowerCase()

      const matchSede =
        sedeFilter === '' || sedeFilter === 'todas' || sedeItem === sedeFilter

      const matchTipo =
        tipoFilter === '' || tipoFilter === 'todos' || tipoItem === tipoFilter

      // ----- Estado / Prioridad (opcionales) -----
      const estadoItem = String(item[estadoKey] ?? '').trim().toLowerCase()
      const matchEstado =
        estadoFilter === '' ||
        estadoFilter === 'todos' ||
        estadoItem === estadoFilter

      const prioridadItem = String(item[prioridadKey] ?? '').trim().toLowerCase()
      const matchPrioridad =
        prioridadFilter === '' ||
        prioridadFilter === 'todos' ||
        prioridadItem === prioridadFilter

      // ----- Fecha (opcional) -----
      let matchFecha = true
      if (startDate || endDate) {
        const itemDate = parseFlexibleDate(item[dateKey])
        if (!itemDate) {
          // si no hay fecha en el item y se filtra por fecha, lo excluimos
          matchFecha = false
        } else {
          matchFecha =
            (!startDate || itemDate >= startDate) &&
            (!endDate || itemDate <= endDate)
        }
      }

      // ----- Búsqueda libre -----
      const matchSearch =
        normalizedSearch === '' ||
        searchKeys.some((key) =>
          String(item[key] ?? '').toLowerCase().includes(normalizedSearch)
        )

      return (
        matchSede &&
        matchTipo &&
        matchEstado &&
        matchPrioridad &&
        matchFecha &&
        matchSearch
      )
    })
  }, [
    data,
    sedeFilter,
    tipoFilter,
    estadoFilter,
    prioridadFilter,
    normalizedSearch,
    startDate,
    endDate,
    sedeKey,
    tipoKey,
    estadoKey,
    prioridadKey,
    dateKey,
    searchKeys,
  ])

  return filteredData
}
