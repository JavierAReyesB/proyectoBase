'use client'

/**
 * Centraliza todas las llamadas API relacionadas con ListadoTrabajos.
 */

export interface Trabajo {
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

// 🔄 Simula una llamada a una API real para obtener trabajos
export async function fetchTrabajos(): Promise<Trabajo[]> {
  try {
    const res = await fetch('/mock/jobTableData.json') // En producción, reemplazar por endpoint real
    if (!res.ok) throw new Error('Error al cargar los trabajos')
    return res.json()
  } catch (error) {
    console.error('❌ Error en fetchTrabajos:', error)
    return []
  }
}

// 🔄 Simula una llamada a una API real para obtener sedes
export async function fetchSedes(): Promise<string[]> {
  try {
    const res = await fetch('/mock/mockSedes.json') // En producción, reemplazar por endpoint real
    if (!res.ok) throw new Error('Error al cargar las sedes')
    return res.json()
  } catch (error) {
    console.error('❌ Error en fetchSedes:', error)
    return []
  }
}

// 🔄 Simula una llamada a una API real para obtener tipos de servicio
export async function fetchTiposServicio(): Promise<TipoServicio[]> {
  try {
    const res = await fetch('/mock/tipoServicio.json') // En producción, reemplazar por endpoint real
    if (!res.ok) throw new Error('Error al cargar los tipos de servicio')
    return res.json()
  } catch (error) {
    console.error('❌ Error en fetchTiposServicio:', error)
    return []
  }
}

// 🧩 Aquí puedes añadir futuras llamadas API
// export async function createTrabajo(data: Partial<Trabajo>) { ... }
// export async function updateTrabajo(id: number, data: Partial<Trabajo>) { ... }
// export async function deleteTrabajo(id: number) { ... }
