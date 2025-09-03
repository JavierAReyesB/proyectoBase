'use client'

import React from 'react'
import type { PlanTrabajo } from '../services/api'

import {
  MultiCardFormulario,
  CardFormRow,
  CardFormActions,
  Label,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  Button,
} from '@/components/cardDrawer/MultiCardFormulario'

interface Props {
  data: PlanTrabajo
}

export default function PlanTrabajoFormulario({ data }: Props) {
  const cards = [
    {
      id: 'info-basica',
      title: 'Información Básica',
      description: 'Completa la información general del plan de trabajo',
      content: (
        <>
          <CardFormRow>
            <Label htmlFor="fecha">Fecha</Label>
            <Input id="fecha" type="date" defaultValue={(data as any).fecha ?? ''} />
          </CardFormRow>

          <CardFormRow>
            <Label htmlFor="sede">Sede</Label>
            <Input id="sede" defaultValue={data.sede} />
          </CardFormRow>

          <CardFormRow>
            <Label htmlFor="tipoTrabajo">Tipo de Trabajo</Label>
            <Input id="tipoTrabajo" defaultValue={data.tipoTrabajo} />
          </CardFormRow>

          <CardFormRow>
            <Label htmlFor="orden">Número de Orden</Label>
            <Input id="orden" placeholder="Ej. 12345" defaultValue={(data as any).orden ?? ''} />
          </CardFormRow>

          <CardFormRow>
            <Label htmlFor="cliente">Cliente</Label>
            <Input id="cliente" placeholder="Nombre del cliente" defaultValue={(data as any).cliente ?? ''} />
          </CardFormRow>
        </>
      ),
    },
    {
      id: 'servicio',
      title: 'Servicio',
      description: 'Detalles del servicio asociado al plan',
      content: (
        <>
          <CardFormRow>
            <Label htmlFor="servicio">Servicio</Label>
            <Input id="servicio" defaultValue={data.servicio} />
          </CardFormRow>

          <CardFormRow>
            <Label htmlFor="operario">Operario</Label>
            <Input id="operario" defaultValue={data.operario} />
          </CardFormRow>

          {/* Select extra 1: Tipo de Servicio */}
          <CardFormRow>
            <Label>Tipo de Servicio</Label>
            <Select defaultValue={(data as any).tipoServicio ?? 'mantenimiento'}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona tipo de servicio" />
              </SelectTrigger>
              <SelectContent
                className="z-[6000]"
                position="popper"
                sideOffset={4}
                data-drawer-portal="true"
              >
                <SelectGroup>
                  <SelectLabel>Opciones</SelectLabel>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="instalacion">Instalación</SelectItem>
                  <SelectItem value="inspeccion">Inspección</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardFormRow>

          {/* Select extra 2: Prioridad */}
          <CardFormRow>
            <Label>Prioridad</Label>
            <Select defaultValue={(data as any).prioridad ?? 'media'}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona prioridad" />
              </SelectTrigger>
              <SelectContent
                className="z-[6000]"
                position="popper"
                sideOffset={4}
                data-drawer-portal="true"
              >
                <SelectGroup>
                  <SelectLabel>Niveles</SelectLabel>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardFormRow>
        </>
      ),
    },
    {
      id: 'recomendaciones',
      title: 'Recomendaciones',
      description: 'Anota observaciones o recomendaciones',
      content: (
        <CardFormRow>
          <Label htmlFor="recomendaciones">Recomendaciones</Label>
          <Textarea id="recomendaciones" defaultValue={data.recomendaciones} />
        </CardFormRow>
      ),
    },
    {
      id: 'resultado',
      title: 'Resultado',
      description: 'Selecciona el resultado del plan',
      content: (
        <>
          <CardFormRow>
            <Label>Resultado</Label>
            <Select defaultValue={data.resultado}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un resultado" />
              </SelectTrigger>
              <SelectContent
                className="z-[6000]"
                position="popper"
                sideOffset={4}
                data-drawer-portal="true"
              >
                <SelectGroup>
                  <SelectLabel>Opciones</SelectLabel>
                  <SelectItem value="Riesgo Nulo">Riesgo Nulo</SelectItem>
                  <SelectItem value="Riesgo Medio">Riesgo Medio</SelectItem>
                  <SelectItem value="Riesgo Grave">Riesgo Grave</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardFormRow>

          {/* Select extra 1: Estado */}
          <CardFormRow>
            <Label>Estado</Label>
            <Select defaultValue={(data as any).estado ?? 'pendiente'}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent
                className="z-[6000]"
                position="popper"
                sideOffset={4}
                data-drawer-portal="true"
              >
                <SelectGroup>
                  <SelectLabel>Estados</SelectLabel>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_progreso">En progreso</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardFormRow>

          {/* Select extra 2: Categoría */}
          <CardFormRow>
            <Label>Categoría</Label>
            <Select defaultValue={(data as any).categoria ?? 'general'}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona categoría" />
              </SelectTrigger>
              <SelectContent
                className="z-[6000]"
                position="popper"
                sideOffset={4}
                data-drawer-portal="true"
              >
                <SelectGroup>
                  <SelectLabel>Categorías</SelectLabel>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="electrica">Eléctrica</SelectItem>
                  <SelectItem value="mecanica">Mecánica</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardFormRow>
        </>
      ),
    },
    {
      id: 'finalizar',
      title: 'Finalizar',
      description: 'Revisa y confirma los datos',
      content: (
        <p className="text-sm text-muted-foreground">
          Si todos los datos son correctos, presiona <strong>Confirmar</strong>{' '}
          para completar el registro.
        </p>
      ),
      footer: (
        <CardFormActions>
          <Button type="button" variant="outline">Cancelar</Button>
          <Button type="button">Confirmar</Button>
        </CardFormActions>
      ),
    },
  ]

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Plan de Trabajo</h1>
      <MultiCardFormulario cards={cards} />
    </div>
  )
}
