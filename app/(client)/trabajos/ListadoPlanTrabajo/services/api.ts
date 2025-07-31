'use client'

/**
 * Centraliza todas las llamadas API relacionadas con PlanTrabajo.
 */

export interface PlanTrabajo {
  id: number
  fecha: string
  sede: string
  tipoTrabajo: string
  servicio: string
  operario: string
  recomendaciones: string
  resultado: 'Riesgo Nulo' | 'Riesgo Medio' | 'Riesgo Grave'
}

export interface TipoServicio {
  nombre: string
  activo: boolean
}

export interface Contrato {
  id: string
  periodo: string
  servicio: string
}

// 🔄 Simula una llamada a una API real para obtener planes de trabajo
export async function fetchPlanesTrabajo(): Promise<PlanTrabajo[]> {
  try {
    const res = await fetch('/mock/jobTableData.json') // En producción, reemplazar por endpoint real
    if (!res.ok) throw new Error('Error al cargar los planes de trabajo')
    return res.json()
  } catch (error) {
    console.error('❌ Error en fetchPlanesTrabajo:', error)
    return []
  }
}

// 🔄 Simula una llamada a una API real para obtener sedes
export async function fetchSedesPlan(): Promise<string[]> {
  try {
    const res = await fetch('/mock/mockSedes.json') // En producción, reemplazar por endpoint real
    if (!res.ok) throw new Error('Error al cargar las sedes')
    return res.json()
  } catch (error) {
    console.error('❌ Error en fetchSedesPlan:', error)
    return []
  }
}

// 🔄 Simula una llamada a una API real para obtener tipos de servicio
export async function fetchTiposServicioPlan(): Promise<TipoServicio[]> {
  try {
    const res = await fetch('/mock/tipoServicio.json') // En producción, reemplazar por endpoint real
    if (!res.ok) throw new Error('Error al cargar los tipos de servicio')
    return res.json()
  } catch (error) {
    console.error('❌ Error en fetchTiposServicioPlan:', error)
    return []
  }
}

// 🔄 Simula una llamada a una API real para obtener categorías
export async function fetchCategoriasPlan(): Promise<string[]> {
  try {
    const res = await fetch('/mock/categorias.json') // En producción, reemplazar por endpoint real
    if (!res.ok) throw new Error('Error al cargar las categorías')
    const data = await res.json()
    return data.categorias || []
  } catch (error) {
    console.error('❌ Error en fetchCategoriasPlan:', error)
    return []
  }
}

// 🔄 Simula una llamada a una API real para obtener contratos asociados
export async function fetchContratosPlan(): Promise<Contrato[]> {
  try {
    const res = await fetch('/mock/contratos.json') // En producción, reemplazar por endpoint real
    if (!res.ok) throw new Error('Error al cargar los contratos')
    const data = await res.json()
    return data.contratos || []
  } catch (error) {
    console.error('❌ Error en fetchContratosPlan:', error)
    return []
  }
}

// 🧩 Aquí puedes añadir futuras llamadas API
// export async function createPlanTrabajo(data: Partial<PlanTrabajo>) { ... }
// export async function updatePlanTrabajo(id: number, data: Partial<PlanTrabajo>) { ... }
// export async function deletePlanTrabajo(id: number) { ... }
