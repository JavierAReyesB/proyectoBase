import { CardData } from '../DashboardCard'
import { api } from '../../../../lib/api'

type ApiSeriesItem = {
  label: string
  color: string
  value: number
}

export async function fetchDashboardCards(): Promise<CardData[]> {
  const res = await api.get<ApiSeriesItem[]>('/dashboardCards')
  const series = res.data

  console.log('🧪 Datos recibidos de la API:', series)

  // Si no vienen datos válidos, devolver un array vacío
  if (!Array.isArray(series) || series.length === 0) return []

  // Simulamos 3 tarjetas con mismo contenido
  const titles = ['Avisos por prioridad', 'Órdenes por estado', 'Solicitudes recientes']
  const ranges = ['Últimos 30 días', 'Este año', 'Semana actual']

  return titles.map((title, i) => ({
    id: i + 1,
    title,
    range: ranges[i],
    legend: series.map((s) => s.label),
    colors: series.map((s) => s.color),
    values: series.map((s) => s.value),
    total: series.reduce((acc, s) => acc + s.value, 0),
  }))
}
