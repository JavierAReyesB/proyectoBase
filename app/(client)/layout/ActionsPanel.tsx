'use client'

import React from 'react'
import { Button } from '@/components/ui/button' 

const ActionsPanel: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Acciones rápidas</h2>
      <p className="text-muted-foreground">Selecciona una acción para ejecutar.</p>

      <div className="flex flex-col space-y-2">
        <Button onClick={() => alert('Creando reporte...')}>📄 Crear reporte</Button>
        <Button onClick={() => alert('Datos actualizados')}>🔄 Refrescar datos</Button>
        <Button onClick={() => alert('Importando...')}>📥 Importar datos</Button>
      </div>
    </div>
  )
}

export default ActionsPanel
