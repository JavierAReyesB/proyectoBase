// app/(tu‑ruta)/dashboard/page.tsx
'use client'

import React from 'react'
import { PageWrapper } from '@/app/(client)/layout/PageWrapper'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { useDrawerContext } from '@/components/drawer/DrawerProvider'

interface DashboardCard {
  key: string
  title: string
  value: string
  badge: string
  badgeVariant: string
  content: React.ReactNode
}

// Datos de ejemplo
const chartData = [
  { name: 'Ene', usuarios: 240 },
  { name: 'Feb', usuarios: 360 },
  { name: 'Mar', usuarios: 480 },
  { name: 'Abr', usuarios: 300 },
  { name: 'May', usuarios: 520 }
]

const cards: DashboardCard[] = [
  {
    key: 'usuarios',
    title: 'Usuarios activos',
    value: '1,240',
    badge: '+8% este mes',
    badgeVariant: 'secondary',
    content: (
      <p>
        Este mes se han registrado más usuarios activos que el anterior, con un
        incremento del 8 %.
      </p>
    )
  },
  {
    key: 'contratos',
    title: 'Contratos firmados',
    value: '324',
    badge: '+5 desde abril',
    badgeVariant: 'outline',
    content: (
      <p>
        Se han firmado 324 contratos, superando los valores de los últimos tres
        meses.
      </p>
    )
  },
  {
    key: 'tickets',
    title: 'Tickets activos',
    value: '57',
    badge: '+14 nuevos',
    badgeVariant: 'destructive',
    content: (
      <p>
        Actualmente hay 57 tickets activos. La mayoría corresponden a soporte
        técnico.
      </p>
    )
  },
  {
    key: 'satisfaccion',
    title: 'Satisfacción',
    value: '92 %',
    badge: 'Excelente',
    badgeVariant: 'default',
    content: (
      <p>
        El índice de satisfacción de usuarios es del 92 %, manteniéndose
        estable.
      </p>
    )
  }
]

export default function DashboardPage() {
  const { openDrawer } = useDrawerContext()

  function handleCardClick(card: DashboardCard) {
  const { key, title, value, badge, badgeVariant } = card

  openDrawer({
    id:          `dashboard-${key}`,
    title,
    width:       'half',
    isPinned:    false,
    instanceId:  `dashboard-${key}`,

    /* --- solo datos planos --- */
    contentKey:  'dashboard-card',
    contentData: { key, title, value, badge, badgeVariant },

    /* UI que se ve al volver a agrandarlo */
    content: (
      <p>
        {title}: {value} ({badge})
      </p>
    )
  })
}


  return (
    <div className='flex flex-col h-full'>
      <PageWrapper
        title='Dashboard'
        description='Panel principal de control y análisis del sistema.'
        className='flex-1 flex flex-col min-h-screen overflow-y-auto'
      >
        {/* KPIs */}
        <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {cards.map((card) => (
            <Card
              key={card.key}
              onClick={() => handleCardClick(card)}
              className='cursor-pointer hover:shadow-lg transition-shadow'
            >
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-2xl font-semibold'>{card.value}</p>
                <Badge className='mt-2' variant={card.badgeVariant as any}>
                  {card.badge}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Gráfico */}
        <section className='bg-white rounded-md border mt-8 p-4'>
          <h2 className='text-lg font-semibold mb-4'>
            Usuarios registrados por mes
          </h2>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='usuarios' fill='#2563eb' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Tabla */}
        <section className='mt-8'>
          <h2 className='text-lg font-semibold mb-4'>Últimos contratos</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className='text-right'>Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Javier Reyes</TableCell>
                <TableCell>
                  <Badge variant='default'>Firmado</Badge>
                </TableCell>
                <TableCell>18/06/2025</TableCell>
                <TableCell className='text-right'>€ 4.200</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>
      </PageWrapper>
    </div>
  )
}
