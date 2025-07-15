'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------------
 * CARD — con 7 variantes de tamaño
 *  - xs   :   10rem ×  6rem
 *  - sm   :   14rem ×  8rem
 *  - md   :   20rem × 10rem   (valor por defecto)
 *  - lg   :   24rem × 12rem
 *  - xl   :   28rem × 14rem
 *  - 2xl  :   32rem × 16rem
 *  - full :   100%   × auto   (se adapta al contenedor)
 * ----------------------------------------------------------------------*/

export type CardSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: CardSize
}

const sizeMap: Record<CardSize, string> = {
  xs: 'w-40 h-24', // 160 × 96
  sm: 'w-56 h-32', // 224 × 128
  md: 'w-80 h-40', // 320 × 160 ← default
  lg: 'w-96 h-48', // 384 × 192
  xl: 'w-[28rem] h-56', // 448 × 224
  '2xl': 'w-[32rem] h-64', // 512 × 256
  full: 'w-full' // ancho completo, alto según contenido
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, size = 'md', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // estilos glassmorphism base
        'rounded-lg border border-white/20 bg-white/20 backdrop-blur-md text-card-foreground shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 hover:bg-white/20 hover:border-white/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer',
        // tamaño elegido
        sizeMap[size],
        // clases extra
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

// ✅ Exportaciones
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
