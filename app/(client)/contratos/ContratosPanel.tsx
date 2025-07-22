'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Search } from 'lucide-react'
import ResponsiveTable from '@/components/tableAGgrid/ResponsiveTable'
import type { ColDef } from 'ag-grid-community'
import { useDrawerContext } from '@/components/drawer/DrawerProvider'
import { ContratoDrawer } from './ContratoDrawer' // NUEVO
import type { Proyecto } from './proyecto'



const columnDefs: ColDef<Proyecto>[] = [
  { field: 'id', headerName: 'ID', pinned: 'left', maxWidth: 70 },
  { field: 'nombre', headerName: 'Proyecto',pinned: 'left', minWidth: 180 },
  { field: 'cliente', headerName: 'Cliente', pinned: 'left',minWidth: 160 },
  {
    field: 'estado',
    headerName: 'Estado',
    cellClass: (p) =>
      p.value === 'Finalizado'
        ? 'text-green-600 font-semibold'
        : p.value === 'Pendiente'
        ? 'text-yellow-600 font-semibold'
        : 'text-blue-600 font-semibold'
  },
  {
    field: 'fechaInicio',
    headerName: 'Inicio',
    valueFormatter: (p) =>
      new Date(p.value).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
    minWidth: 120
  },
  {
    field: 'fechaFin',
    headerName: 'Fin',
    valueFormatter: (p) =>
      new Date(p.value).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
    minWidth: 120
  },
  {
    field: 'presupuesto',
    headerName: 'Presupuesto (€)',
    valueFormatter: (p) => `${p.value.toLocaleString('es-ES')} €`,
    minWidth: 140
  },
  { field: 'responsable', headerName: 'Responsable', minWidth: 140 },
  { field: 'departamento', headerName: 'Departamento', minWidth: 120 },
  { field: 'prioridad', headerName: 'Prioridad', minWidth: 100 },
  { field: 'tecnologia', headerName: 'Tecnología', minWidth: 100 },
  { field: 'observaciones', headerName: 'Observaciones', minWidth: 200 }
]

export default function ContratosPanel() {
  const [open, setOpen] = useState(false)
  const [tipo, setTipo] = useState('')
  const [nombre, setNombre] = useState('')
  const [rowData, setRowData] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)

  const { openDrawer } = useDrawerContext()
  const orden = 'fechaFin' // Puedes cambiarlo por otro criterio si lo necesitas

  useEffect(() => {
    fetch('/mock/proyectos.json')
      .then((res) => res.json())
      .then((data: Proyecto[]) => {
        setRowData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error cargando proyectos:', err)
        setLoading(false)
      })
  }, [])

  const handleSearch = () => {
    console.log('Buscando contrato:', nombre)
  }

  const handleRowClick = (row: Proyecto) => {
    openDrawer({
      id: `contrato-${row.id}`,
      instanceId: `contrato-${row.id}`,
      title: 'Contratos', 
      width: 'half',
      isPinned: false,
      icon: null,
      contentKey: 'contrato',
      contentData: {
        proyecto: row,
        orden
      },
      content: <ContratoDrawer data={row} orden={orden} />
    })
  }

  return (
    <>
      <div className="flex-1 rounded-md border border-muted p-4 overflow-auto">
        {loading ? (
          <p className="text-center text-muted-foreground">
            Cargando datos…
          </p>
        ) : rowData.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay contratos registrados todavía.
          </p>
        ) : (
          <ResponsiveTable<Proyecto>
            columnDefs={columnDefs}
            rowData={rowData}
            breakpoint={1024}
            pagination
            onRowClick={handleRowClick}
            mobileCardProps={{
              titleField: 'nombre',
              hiddenFields: ['id', 'presupuesto'],
              defaultCompact: true
            }}
          />
        )}
      </div>

      <Modal
        title="Crear contrato"
        description="Ingresa los datos requeridos."
        size="full"
        open={open}
        onOpenChange={setOpen}
      >
        <div className="space-y-6">
          <div className="relative w-full">
            <Input
              className="pr-24"
              placeholder="Ej. Contrato de prestación…"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
            <Button
              size="xs"
              type="button"
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              Buscar
            </Button>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Tipo de contrato
            </label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tipo de contrato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fijo">Contrato fijo</SelectItem>
                <SelectItem value="indefinido">Contrato indefinido</SelectItem>
                <SelectItem value="temporal">Contrato temporal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setOpen(false)}>Guardar</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
