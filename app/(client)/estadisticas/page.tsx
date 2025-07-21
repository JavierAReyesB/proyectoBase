'use client'

import { PageWrapper } from '@/app/(client)/layout/PageWrapper'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

const data = [
  { name: 'Ene', usuarios: 30 },
  { name: 'Feb', usuarios: 45 },
  { name: 'Mar', usuarios: 60 },
  { name: 'Abr', usuarios: 80 },
  { name: 'May', usuarios: 50 }
]

export default function EstadisticasPage() {
  return (
    <PageWrapper
      title='Estadísticas Generales'
      description='Resumen visual de actividad, rendimiento y registros.'
    >
      {/* Cards de resumen */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Usuarios activos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-semibold'>1,240</p>
            <Badge className='mt-2' variant='secondary'>
              +12% este mes
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contratos generados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-semibold'>324</p>
            <Badge variant='outline' className='mt-2'>
              +5% respecto a abril
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Errores reportados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-semibold'>7</p>
            <Badge variant='destructive' className='mt-2'>
              -22% este mes
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tickets resueltos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-semibold'>98%</p>
            <Badge variant='default' className='mt-2'>
              Excelente
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de barras */}
      <div className='bg-white dark:bg-zinc-900 rounded-md border mt-8 p-4'>
        <h2 className='text-lg font-semibold mb-4'>Usuarios por mes</h2>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={data}>
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='usuarios' fill='#2563eb' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla simple */}
      <div className='mt-8'>
        <h2 className='text-lg font-semibold mb-4'>Top usuarios</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Actividad</TableHead>
              <TableHead className='text-right'>Último acceso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Ana Torres</TableCell>
              <TableCell>54 acciones</TableCell>
              <TableCell className='text-right'>18/06/2025</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Javier Reyes</TableCell>
              <TableCell>49 acciones</TableCell>
              <TableCell className='text-right'>17/06/2025</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Lucía Gómez</TableCell>
              <TableCell>38 acciones</TableCell>
              <TableCell className='text-right'>15/06/2025</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </PageWrapper>
  )
}
