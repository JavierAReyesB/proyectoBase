'use client'

import React, { useState } from 'react'
import type { Producto } from '../services/api'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface Props {
  data: Producto
}

export function ProductoFormulario({ data }: Props) {
  const [form, setForm] = useState({
    sede: data.sede,
    nombreProducto: data.nombreProducto,
    registro: data.registro,
    materiaActiva: data.materiaActiva,
    tipoProducto: data.tipoProducto,
    estado: data.estado,
    foto: data.foto
  })

  const handle = (f: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [f]: e.target.value })
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Guardar cambios del producto:', form)
    // Aquí iría la llamada real a la API…
  }

  return (
    <form onSubmit={submit} className="w-full space-y-6">
      <h3 className="text-lg font-semibold">Editar Producto</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div>
          <Label>Sede</Label>
          <Input value={form.sede} onChange={handle('sede')} />
        </div>
        <div>
          <Label>Nombre del Producto</Label>
          <Input value={form.nombreProducto} onChange={handle('nombreProducto')} />
        </div>
        <div>
          <Label>Nº de Registro</Label>
          <Input value={form.registro} onChange={handle('registro')} />
        </div>
        <div>
          <Label>Materia Activa</Label>
          <Input value={form.materiaActiva} onChange={handle('materiaActiva')} />
        </div>
        <div>
          <Label>Tipo de Producto</Label>
          <Input value={form.tipoProducto} onChange={handle('tipoProducto')} />
        </div>
        <div>
          <Label>Estado</Label>
          <Input value={form.estado} onChange={handle('estado')} />
        </div>
        <div className="md:col-span-2">
          <Label>URL de la Foto</Label>
          <Input value={form.foto} onChange={handle('foto')} />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost">
          Cancelar
        </Button>
        <Button type="submit">Guardar cambios</Button>
      </div>
    </form>
  )
}
