'use client'

import React from 'react'
import type { Proyecto } from './proyecto'

interface ContratoDrawerProps {
  data: Proyecto
  orden?: string
}

export function ContratoDrawer({ data, orden }: ContratoDrawerProps) {
  const ordenLabel = orden === 'fechaFin' ? 'Fecha de Fin' : 'Presupuesto'

  return (
    <div className="bg-white rounded-md border p-6 space-y-6 shadow-sm">
      {/* Encabezado */}
      <div>
        <h2 className="text-lg font-semibold mb-1">
          Detalles del Contrato
        </h2>
        <p className="text-sm text-muted-foreground">
          Información detallada del proyecto seleccionado.
        </p>
      </div>

      {/* Información en formato grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <label className="block text-muted-foreground">Proyecto</label>
          <p className="font-medium">{data.nombre}</p>
        </div>
        <div>
          <label className="block text-muted-foreground">Cliente</label>
          <p className="font-medium">{data.cliente}</p>
        </div>
        <div>
          <label className="block text-muted-foreground">Inicio</label>
          <p className="font-medium">{data.fechaInicio}</p>
        </div>
        <div>
          <label className="block text-muted-foreground">Fin</label>
          <p className="font-medium">{data.fechaFin}</p>
        </div>
        <div>
          <label className="block text-muted-foreground">Responsable</label>
          <p className="font-medium">{data.responsable}</p>
        </div>
        <div>
          <label className="block text-muted-foreground">Presupuesto</label>
          <p className="font-medium">{data.presupuesto.toLocaleString('es-ES')} €</p>
        </div>
        <div>
          <label className="block text-muted-foreground">Prioridad</label>
          <p className="font-medium">{data.prioridad}</p>
        </div>
        <div>
          <label className="block text-muted-foreground">Tecnología</label>
          <p className="font-medium">{data.tecnologia}</p>
        </div>
      </div>

      {/* Observaciones */}
      <div>
        <label className="block text-muted-foreground mb-1">Observaciones</label>
        <p className="text-sm text-muted-foreground">{data.observaciones}</p>
      </div>

      {/* Footer */}
      <div className="pt-2 text-xs italic text-muted-foreground">
        Ordenado por: {ordenLabel}
      </div>
    </div>
  )
}
