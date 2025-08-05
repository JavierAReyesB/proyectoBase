'use client'

/**
 * Centraliza todas las llamadas API relacionadas con ListadoPuntos.
 */

export interface Punto {
  id: number
  fecha: string
  sede: string
  tipoTrabajo: string
  servicio: string
  operario: string
  recomendaciones: string
  resultado: 'Riesgo Nulo' | 'Riesgo Medio' | 'Riesgo Grave'
  prioridad: string 
}

export interface TipoPunto {
  nombre: string
  activo: boolean
}

// 🔄 Simula una llamada a una API real para obtener puntos
export async function fetchPuntos(): Promise<Punto[]> {
  try {
    const res = await fetch('/mock/jobTableData.json') // En producción, reemplazar por endpoint real 
    if (!res.ok) throw new Error('Error al cargar los puntos')
    return res.json()
  } catch (error) {
    console.error('❌ Error en fetchPuntos:', error)
    return []
  }
}

// 🔄 Simula una llamada a una API real para obtener sedes
// export async function fetchSedesPunto(): Promise<string[]> {
//   try {
//     const res = await fetch('/mock/mockSedes.json')
//     if (!res.ok) throw new Error('Error al cargar las sedes')
//     return res.json()
//   } catch (error) {
//     console.error('❌ Error en fetchSedesPunto:', error)
//     return []
//   }
// }

// 🔄 Simula una llamada a una API real para obtener tipos de punto
export async function fetchTiposPunto(): Promise<TipoPunto[]> {
  try {
    const res = await fetch('/mock/tipoServicio.json')
    if (!res.ok) throw new Error('Error al cargar los tipos de punto')
    return res.json()
  } catch (error) {
    console.error('❌ Error en fetchTiposPunto:', error)
    return []
  }
}

// 🧩 Aquí puedes añadir futuras llamadas API
// export async function createPunto(data: Partial<Punto>) { ... }
// export async function updatePunto(id: number, data: Partial<Punto>) { ... }
// export async function deletePunto(id: number) { ... }
