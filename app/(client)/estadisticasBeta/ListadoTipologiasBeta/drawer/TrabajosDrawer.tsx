'use client'

import React from 'react'
import type { Trabajo } from '../services/api'
import TrabajosFormulario from './TrabajosFormulario'
import { TrabajosTabla } from './TrabajosTabla'
import { MultiSelect } from '@/components/ui/multi-select'

// 👇 Importa tu wrapper del Accordion (Radix + Tailwind)
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

interface Props {
  data: Trabajo
}

export function TrabajoDrawer({ data }: Props) {
  const opciones = [
    { value: 'fumigacion', label: 'Fumigación' },
    { value: 'desinfeccion', label: 'Desinfección' },
    { value: 'desratizacion', label: 'Desratización' },
    { value: 'inspeccion', label: 'Inspección' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'urgente', label: 'Urgente' },
    { value: 'programado', label: 'Programado' },
    { value: 'seguimiento', label: 'Seguimiento' },
  ]

  const [selected, setSelected] = React.useState<string[]>(['inspeccion', 'programado'])

  return (
    <div className="w-full">
      <Accordion type="single" collapsible defaultValue="panel-servicios" className="w-full divide-y rounded-md border bg-white">
        {/* Panel 1: MultiSelect */}
        <AccordionItem value="panel-servicios">
          <AccordionTrigger className="px-4">Servicios aplicados</AccordionTrigger>
          <AccordionContent className="px-4">
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="text-sm font-medium mb-2">Selecciona múltiples servicios</h4>
              <MultiSelect
                options={opciones}
                value={selected}
                onChange={setSelected}
                placeholder="Selecciona servicios..."
                searchPlaceholder="Buscar servicio..."
                emptyMessage="Sin resultados"
                maxSelected={5}
                columnThreshold={0}   // fuerza grid siempre
                columnCount={3}       // tres columnas
              />
              <pre className="mt-2 text-xs text-gray-500">
                Seleccionado: {JSON.stringify(selected)}
              </pre>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Panel 2: Formulario */}
        <AccordionItem value="panel-formulario">
          <AccordionTrigger className="px-4">Formulario del trabajo</AccordionTrigger>
          <AccordionContent className="px-4">
            <div className="rounded-md border p-4 bg-white">
              <TrabajosFormulario data={data} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Panel 3: Tabla */}
        <AccordionItem value="panel-tabla">
          <AccordionTrigger className="px-4">Detalle y documentos</AccordionTrigger>
          <AccordionContent className="px-4">
            <div className="rounded-md border p-4 bg-white">
              <TrabajosTabla data={data} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
