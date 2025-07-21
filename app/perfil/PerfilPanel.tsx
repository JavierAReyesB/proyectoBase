'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function PerfilPanel() {
  const [userData, setUserData] = useState({
    nombre: '',
    email: '',
    rol: '',
    departamento: '',
  })

  const [editing, setEditing] = useState(false)

  useEffect(() => {
    // Simula datos reales
    setUserData({
      nombre: 'Juan Pérez',
      email: 'juan.perez@example.com',
      rol: 'Administrador',
      departamento: 'Tecnología',
    })
  }, [])

  const handleSave = () => {
    console.log('Datos guardados:', userData)
    setEditing(false)
  }

  return (
    <div className="space-y-6 bg-white border rounded-md p-6 max-w-xl">
      <h2 className="text-xl font-semibold">Perfil del usuario</h2>

      {editing ? (
        <div className="space-y-4">
          <Input
            value={userData.nombre}
            onChange={(e) => setUserData({ ...userData, nombre: e.target.value })}
            placeholder="Nombre completo"
          />
          <Input
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            placeholder="Correo electrónico"
          />
          <Input
            value={userData.departamento}
            onChange={(e) => setUserData({ ...userData, departamento: e.target.value })}
            placeholder="Departamento"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setEditing(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar cambios</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-sm text-muted-foreground">
          <p><strong>Nombre:</strong> {userData.nombre}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Rol:</strong> {userData.rol}</p>
          <p><strong>Departamento:</strong> {userData.departamento}</p>

          <div className="flex justify-end">
            <Button onClick={() => setEditing(true)}>Editar perfil</Button>
          </div>
        </div>
      )}
    </div>
  )
}
