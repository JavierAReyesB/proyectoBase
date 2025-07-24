'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  type CardSize
} from '@/components/ui/card'
import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector
} from 'recharts'

export type CardData = {
  id: number
  title: string
  range: string
  legend: string[]
  colors: string[]
  total: number
  values: number[]
}

interface DashboardCardProps {
  data: CardData
  size?: CardSize
  className?: string
}

export function DashboardCard({
  data,
  size = 'full',
  className
}: DashboardCardProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const chartData = data.legend.map((label, i) => ({
    name: label,
    value: data.values[i],
    fill: data.colors[i]
  }))

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const renderActiveShape = (props: any) => {
    const {
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, value
    } = props

    const RADIAN = Math.PI / 180
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? 'start' : 'end'

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
          {`${value}%`}
        </text>
      </g>
    )
  }

  return (
    <Card
      size={size}
      className={cn(
        'relative w-full h-full min-h-[22rem] flex flex-col justify-between rounded-xl border border-white/30 bg-white/70 backdrop-blur-md shadow-md hover:shadow-lg transition-shadow',
        className
      )}
    >
      {/* Encabezado */}
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-800">
          📊 {data.title} desde {data.range}
        </CardTitle>
      </CardHeader>

      {/* Contenido principal */}
      <CardContent className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 overflow-visible z-10">
        {/* Gráfico con espacio responsive */}
        <div className="w-full max-w-[280px] h-[240px] overflow-visible">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Leyenda */}
        <div className="flex flex-col gap-1 text-sm text-gray-800">
          {chartData.map((entry, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.fill }}
              />
              {entry.name}: {entry.value}%
            </div>
          ))}
        </div>
      </CardContent>

      {/* Pie de tarjeta */}
      <div className="px-6 pb-4 text-xs text-gray-600">
        <p>(*) Pulse en cada serie para ver detalle</p>
        <p className="text-[10px] text-gray-400">Gráfico generado con Recharts</p>
      </div>

      {/* Botón flotante */}
      <button className="absolute right-4 top-4 rounded-full bg-gray-100 p-1 hover:bg-gray-200">
        <Download size={16} className="text-gray-700" />
      </button>
    </Card>
  )
}

/* 
📌 NOTA IMPORTANTE SOBRE LA ESTRUCTURA DE DATOS

Este componente espera que los datos del gráfico se pasen en el siguiente formato (tipo CardData):

{
  id: number,
  title: string,                   // Título del gráfico
  range: string,                   // Rango de fechas (ej. "24/04/2025 hasta 23/07/2025")
  legend: string[],                // Etiquetas de cada categoría (ej. ["Rojo", "Verde"])
  colors: string[],                // Colores correspondientes a cada categoría
  values: number[],                // Valores porcentuales (ej. [50, 30])
  total: number                    // Total opcional (actualmente no usado)
}

🔁 Si los datos vienen desde una API en un formato distinto (por ejemplo como array de objetos con { label, color, value }),
es necesario transformarlos antes de pasarlos al componente.

Ejemplo de transformación:

function transformApiDataToCardData(apiData: any[], title: string, range: string): CardData {
  return {
    id: Math.random(), // Reemplaza por un ID real si es necesario
    title,
    range,
    legend: apiData.map(item => item.label),
    colors: apiData.map(item => item.color),
    values: apiData.map(item => item.value),
    total: apiData.reduce((sum, item) => sum + item.value, 0)
  }
}

✔️ Esto asegura compatibilidad con el componente gráfico Recharts sin modificar su lógica interna.
*/
