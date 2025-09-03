# 🃏 MultiCardFormulario

## ¿Qué es?
`MultiCardFormulario` es un **wrapper reutilizable** para construir formularios en múltiples secciones (cards).  
Cada sección se define como un objeto en un array `cards`, y el componente se encarga de renderizarlas de forma consistente.

---

## Estructura de una Card

Cada card en el array debe tener la siguiente forma:

```ts
interface CardConfig {
  id: string
  title: string
  description?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  content: React.ReactNode
  footer?: React.ReactNode
}
id → identificador único (string).

title → título de la card.

description → texto descriptivo opcional.

size → tamaño de la card (default: full).

content → JSX con inputs, selects, etc.

footer → botones o acciones opcionales.

Subcomponentes disponibles
Además de MultiCardFormulario, se exportan componentes auxiliares para construir formularios:

CardFormRow → agrupa campos con espaciado vertical.

CardFormActions → agrupa botones en el footer.

Label, Input, Textarea → campos básicos.

Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel → selects avanzados.

Checkbox, RadioGroup, RadioGroupItem → campos de selección.

Button → botón estilizado.

Ejemplo de uso
tsx
Copiar
Editar
'use client'

import React from 'react'
import type { Trabajo } from '../services/api'
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
  data: Trabajo
}

export default function TrabajosFormulario({ data }: Props) {
  const cards = [
    {
      id: 'info-basica',
      title: 'Información Básica',
      description: 'Completa la información general del trabajo',
      content: (
        <>
          <CardFormRow>
            <Label htmlFor="fecha">Fecha</Label>
            <Input id="fecha" type="date" defaultValue={data.fecha} />
          </CardFormRow>
          <CardFormRow>
            <Label htmlFor="sede">Sede</Label>
            <Input id="sede" defaultValue={data.sede} />
          </CardFormRow>
        </>
      ),
    },
    {
      id: 'resultado',
      title: 'Resultado',
      description: 'Selecciona el resultado de la evaluación',
      content: (
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
      ),
      footer: (
        <CardFormActions>
          <Button variant="outline">Cancelar</Button>
          <Button>Confirmar</Button>
        </CardFormActions>
      ),
    },
  ]

  return <MultiCardFormulario cards={cards} />
}
Ventajas

🔄 Reutilizable → Define cualquier formulario como un array de cards.

🎨 Consistente → Todas las secciones comparten estilos y estructura.

⚡ Escalable → Puedes añadir, quitar o reordenar secciones sin tocar el layout general.

📦 Centralizado → Todos los componentes UI se importan desde un único archivo.

Tips
Usa defaultValue si solo necesitas inicializar los inputs.

Usa value + onValueChange si necesitas estado controlado (ej. guardar cambios en memoria o enviar a API).

Ajusta SelectContent con z-[6000] y position="popper" si renderizas dentro de un Drawer/Dialog.










