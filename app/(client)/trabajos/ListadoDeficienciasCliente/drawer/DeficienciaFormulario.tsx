'use client'

import React, { useState } from 'react'
import type { Deficiencia } from '../services/api'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface Props {
  data: Deficiencia
}

export function DeficienciaFormulario({ data }: Props) {
  const [form, setForm] = useState({
    sede: data.sede,
    tipoTrabajo: data.tipoTrabajo,
    servicio: data.servicio,
    operario: data.operario,
    resultado: data.resultado,
    recomendaciones: data.recomendaciones
  })

  const handle = (f: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [f]: e.target.value })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Guardar cambios:', form)
    // Aquí tu llamada a la API …
  }

  return (
    <form onSubmit={submit} className="w-full space-y-6">
      <h3 className="text-lg font-semibold">Editar Deficiencia</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div>
          <Label>Sede</Label>
          <Input value={form.sede} onChange={handle('sede')} />
        </div>
        <div>
          <Label>Tipo de Trabajo</Label>
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
        <Textarea rows={3} value={form.recomendaciones} onChange={handle('recomendaciones')} />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost">
          Cancelar
        </Button>
        <Button type="submit">Guardar cambios</Button>
      </div>
    </form>
  )
}
