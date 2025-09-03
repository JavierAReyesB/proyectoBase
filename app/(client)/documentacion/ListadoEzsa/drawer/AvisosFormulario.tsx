'use client'

import React, { useState } from 'react'
import type { Aviso } from '../services/api'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

// ⬇️ Tu wrapper de Select (todos los exports)
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@/components/ui/select'

// ⬇️ Tu Card personalizada (glass + size)
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface Props {
  data: Aviso
}

export function AvisosFormulario({ data }: Props) {
  const [form, setForm] = useState({
    sede: data.sede,
    tipoTrabajo: data.tipoTrabajo,
    servicio: data.servicio,
    operario: data.operario,
    resultado: data.resultado,
    recomendaciones: data.recomendaciones,
    estado: (data as any).estado ?? 'pendiente',
    select2: 'op1',
    select3: 'op1',
    select4: 'op1',
    select5: 'op1',
  })

  const handle =
    (f: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [f]: e.target.value })

  const handleValue = (f: keyof typeof form) => (value: string) =>
    setForm({ ...form, [f]: value })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Guardar cambios:', form)
    // TODO: llamada a la API …
  }

  return (
    <form onSubmit={submit} className="w-full space-y-6">
      <h3 className="text-lg font-semibold">Editar Deficiencia</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div>
          <Label>Sede</Label>
          <Input value={form.sede} onChange={handle('sede')} />
        </div>
        <div>
          <Label>Tipo de Trabajo</Label>
          <Input value={form.tipoTrabajo} onChange={handle('tipoTrabajo')} />
        </div>
        <div>
          <Label>Servicio</Label>
          <Input value={form.servicio} onChange={handle('servicio')} />
        </div>
        <div>
          <Label>Operario</Label>
          <Input value={form.operario} onChange={handle('operario')} />
        </div>
        <div>
          <Label>Resultado</Label>
          <Input value={form.resultado} onChange={handle('resultado')} />
        </div>
      </div>

      <div>
        <Label>Recomendaciones</Label>
        <Textarea
          rows={3}
          value={form.recomendaciones}
          onChange={handle('recomendaciones')}
        />
      </div>

      {/* Card con 5 selects en fila */}
      <Card size="full" className="cursor-auto hover:translate-y-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Campos adicionales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Select 1: Estado */}
            <div>
              <Label className="mb-2 block">Estado</Label>
              <Select value={form.estado} onValueChange={handleValue('estado')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent className="z-[6000]" position="popper" sideOffset={4}>
                  <SelectGroup>
                    <SelectLabel>Abiertas</SelectLabel>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="en_progreso">En progreso</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Cerradas</SelectLabel>
                    <SelectItem value="resuelto">Resuelto</SelectItem>
                    <SelectItem value="no_procede">No procede</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Select 2 */}
            <div>
              <Label className="mb-2 block">Select 2</Label>
              <Select value={form.select2} onValueChange={handleValue('select2')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent className="z-[6000]" position="popper" sideOffset={4}>
                  <SelectItem value="op1">Opción 1</SelectItem>
                  <SelectItem value="op2">Opción 2</SelectItem>
                  <SelectItem value="op3">Opción 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Select 3 */}
            <div>
              <Label className="mb-2 block">Select 3</Label>
              <Select value={form.select3} onValueChange={handleValue('select3')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent className="z-[6000]" position="popper" sideOffset={4}>
                  <SelectItem value="op1">Opción 1</SelectItem>
                  <SelectItem value="op2">Opción 2</SelectItem>
                  <SelectItem value="op3">Opción 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Select 4 */}
            <div>
              <Label className="mb-2 block">Select 4</Label>
              <Select value={form.select4} onValueChange={handleValue('select4')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent className="z-[6000]" position="popper" sideOffset={4}>
                  <SelectItem value="op1">Opción 1</SelectItem>
                  <SelectItem value="op2">Opción 2</SelectItem>
                  <SelectItem value="op3">Opción 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Select 5 */}
            <div>
              <Label className="mb-2 block">Select 5</Label>
              <Select value={form.select5} onValueChange={handleValue('select5')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent className="z-[6000]" position="popper" sideOffset={4}>
                  <SelectItem value="op1">Opción 1</SelectItem>
                  <SelectItem value="op2">Opción 2</SelectItem>
                  <SelectItem value="op3">Opción 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost">
          Cancelar
        </Button>
        <Button type="submit">Guardar cambios</Button>
      </div>
    </form>
  )
}
