'use client'

/**
 * Centraliza todas las llamadas API relacionadas con ListadoProductos.
 */

export interface Producto {
  id: number
  sede: string
  nombreProducto: string
  registro: string
  materiaActiva: string
  tipoProducto: string
  estado: 'Activo' | 'Inactivo' | 'Pendiente'
  foto: string
}



export interface TipoServicio {
  nombre: string
  activo: boolean
}

// 🔄 Simula una llamada a una API real para obtener productos
export async function fetchProductos(): Promise<Producto[]> {
  try {
    const res = await fetch('/mock/productoTableData.json') // En producción, reemplazar por endpoint real
    if (!res.ok) throw new Error('Error al cargar los productos')
    return res.json()
  } catch (error) {
    console.error('❌ Error en fetchProductos:', error)
    return []
  }
}

// 🔄 Simula una llamada a una API real para obtener sedes
export async function fetchSedesProducto(): Promise<string[]> {
  try {
    const res = await fetch('/mock/mockSedes.json') // En producción, reemplazar por endpoint real
    if (!res.ok) throw new Error('Error al cargar las sedes')
    return res.json()
  } catch (error) {
    console.error('❌ Error en fetchSedesProducto:', error)
    return []
  }
}

// 🔄 Simula una llamada a una API real para obtener tipos de servicio
export async function fetchTiposServicioProducto(): Promise<TipoServicio[]> {
  try {
    const res = await fetch('/mock/tiposervicio.json') // En producción, reemplazar por endpoint real
    if (!res.ok) throw new Error('Error al cargar los tipos de servicio')
    return res.json()
  } catch (error) {
    console.error('❌ Error en fetchTiposServicioProducto:', error)
    return []
  }
}

// 🔄 Simula una llamada a una API real para obtener categorías
export async function fetchCategoriasProducto(): Promise<string[]> {
  try {
    const res = await fetch('/mock/categorias.json') // En producción, reemplazar por endpoint real
    if (!res.ok) throw new Error('Error al cargar las categorías')
    const data = await res.json()
    return data.categorias || []
  } catch (error) {
    console.error('❌ Error en fetchCategoriasProducto:', error)
    return []
  }
}

// 🧩 Aquí puedes añadir futuras llamadas API
// export async function createProducto(data: Partial<Producto>) { ... }
// export async function updateProducto(id: number, data: Partial<Producto>) { ... }
// export async function deleteProducto(id: number) { ... }
