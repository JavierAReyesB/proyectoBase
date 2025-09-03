'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// 🃏 Card base
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardSize 
} from '@/components/ui/card'

// 📑 Form elements
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

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

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

// ----------------------------------------------------------------------
// CARD FORMULARIO — versión extendida con todos los elementos de entrada
// ----------------------------------------------------------------------

interface CardFormularioProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  footer?: React.ReactNode
  size?: CardSize
}

const CardFormulario = React.forwardRef<
  HTMLDivElement,
  CardFormularioProps
>(({ className, title, description, footer, children, ...props }, ref) => (
  <Card
    ref={ref}
    size="full" 
    className={cn(
      'flex flex-col gap-4 p-6 w-full',
      className
    )}
    {...props}
  >
    {(title || description) && (
      <CardHeader className="pb-2">
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
    )}

    <CardContent className="flex flex-col gap-4">{children}</CardContent>

    {footer && <CardFooter>{footer}</CardFooter>}
  </Card>
))
CardFormulario.displayName = 'CardFormulario'

// ----------------------------------------------------------------------
// Subcomponentes de ayuda para el layout de formularios
// ----------------------------------------------------------------------

const CardFormRow = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-2', className)} {...props} />
)

const CardFormActions = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex justify-end gap-2', className)} {...props} />
)

// ✅ Exportaciones centralizadas
export {
  CardFormulario,
  CardFormRow,
  CardFormActions,
  // UI reexportados
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
  RadioGroup,
  RadioGroupItem,
  Checkbox,
  Button,
}
