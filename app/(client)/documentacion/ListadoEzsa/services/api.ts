'use client'

/**
 * Centraliza todas las llamadas API relacionadas con ListadoAvisos.
 */

export interface Aviso {
  id: number
  fecha: string
  sede: string
  tipoTrabajo: string
  servicio: string
  operario: string
  recomendaciones: string
  resultado: 'Riesgo Nulo' | 'Riesgo Medio' | 'Riesgo Grave'
  prioridad: string // ✅ agrega esta línea
}

export interface TipoAviso {
  nombre: string
  activo: boolean
}

// 🔄 Simula una llamada a una API real para obtener avisos
export async function fetchAvisos(): Promise<Aviso[]> {
  try {
    const res = await fetch('/mock/jobTableData.json') // En producción, reemplazar por endpoint real 
    if (!res.ok) throw new Error('Error al cargar los avisos')
    return res.json()
  } catch (error) {
    console.error('❌ Error en fetchAvisos:', error)
    return []
  }
}

// 🔄 Simula una llamada a una API real para obtener sedes
export async function fetchSedesAviso(): Promise<string[]> {
  try {
    const res = await fetch('/mock/mockSedes.json')
    if (!res.ok) throw new Error('Error al cargar las sedes')
    return res.json()
  } catch (error) {
    console.error('❌ Error en fetchSedesAviso:', error)
    return []
  }
}

// 🔄 Simula una llamada a una API real para obtener tipos de aviso
export async function fetchTiposAviso(): Promise<TipoAviso[]> {
  try {
    const res = await fetch('/mock/tipoServicio.json')
    if (!res.ok) throw new Error('Error al cargar los tipos de aviso')
    return res.json()
  } catch (error) {
    console.error('❌ Error en fetchTiposAviso:', error)
    return []
  }
}

// 🧩 Aquí puedes añadir futuras llamadas API
// export async function createAviso(data: Partial<Aviso>) { ... }
// export async function updateAviso(id: number, data: Partial<Aviso>) { ... }
// export async function deleteAviso(id: number) { ... }
