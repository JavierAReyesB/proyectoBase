'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// Importamos todo desde cardFormulario
import {
  CardFormulario,
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
  SelectSeparator,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Button,
} from '@/components/cardDrawer/cardFormulario'

// 👇 Tipo de configuración de cada card
interface CardConfig {
  id: string
  title: string
  description?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  content: React.ReactNode
  footer?: React.ReactNode
}

interface MultiCardFormularioProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  cards: CardConfig[]
}

const MultiCardFormulario: React.FC<MultiCardFormularioProps> = ({
  className,
  cards,
  ...props
}) => {
  return (
    <div
      className={cn('grid grid-cols-1 gap-8 w-full', className)}
      {...props}
    >
      {cards.map((card) => (
        <CardFormulario
          key={card.id}
          size={card.size ?? 'full'}
          title={card.title}
          description={card.description}
          footer={card.footer}
        >
          {card.content}
        </CardFormulario>
      ))}
    </div>
  )
}

// ✅ Exportamos TODO desde aquí para usar un solo import
export {
  MultiCardFormulario,
  CardFormulario,
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
  SelectSeparator,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Button,
}

export type { CardConfig }
