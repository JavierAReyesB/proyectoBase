'use client'

/**
 * Centraliza todas las llamadas API relacionadas con ListadoDeficiencias.
 */

export interface Deficiencia {
  id: number
  fecha: string
  sede: string
  tipoTrabajo: string
  servicio: string
  operario: string
  recomendaciones: string
  resultado: 'Riesgo Nulo' | 'Riesgo Medio' | 'Riesgo Grave'
  estado: string
  criticidad: string
}

export interface TipoServicio {
  nombre: string
  activo: boolean
}

// 🔄 Simula una llamada a una API real para obtener deficiencias
export async function fetchDeficiencias(): Promise<Deficiencia[]> {
  try {
    const res = await fetch('/mock/jobTableData.json') // En producción, reemplazar por endpoint real
    if (!res.ok) throw new Error('Error al cargar las deficiencias')
    return res.json()
  } catch (error) {
    console.error('❌ Error en fetchDeficiencias:', error)
    return []
  }
}

// 🔄 Simula una llamada a una API real para obtener sedes
export async function fetchSedesDef(): Promise<string[]> {
  try {
    const res = await fetch('/mock/mockSedes.json') // En producción, reemplazar por endpoint real
    if (!res.ok) throw new Error('Error al cargar las sedes')
    return res.json()
  } catch (error) {
    console.error('❌ Error en fetchSedesDef:', error)
    return []
  }
}

// 🔄 Simula una llamada a una API real para obtener tipos de servicio
export async function fetchTiposServicioDef(): Promise<TipoServicio[]> {
  try {
    const res = await fetch('/mock/tipoServicio.json') // En producción, reemplazar por endpoint real
    if (!res.ok) throw new Error('Error al cargar los tipos de servicio')
    return res.json()
  } catch (error) {
    console.error('❌ Error en fetchTiposServicioDef:', error)
    return []
  }
}

// 🔄 Simula una llamada a una API real para obtener categorías
export async function fetchCategoriasDef(): Promise<string[]> {
  try {
    const res = await fetch('/mock/categorias.json') // En producción, reemplazar por endpoint real
    if (!res.ok) throw new Error('Error al cargar las categorías')
    const data = await res.json()
    return data.categorias || []
  } catch (error) {
    console.error('❌ Error en fetchCategoriasDef:', error)
    return []
  }
}

// 🧩 Aquí puedes añadir futuras llamadas API
// export async function createDeficiencia(data: Partial<Deficiencia>) { ... }
// export async function updateDeficiencia(id: number, data: Partial<Deficiencia>) { ... }
// export async function deleteDeficiencia(id: number) { ... }
