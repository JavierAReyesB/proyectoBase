'use client'

/* -------------------------------------------------------------
 *  IMPORTS BÁSICOS
 * ----------------------------------------------------------- */
import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------
 *  VARIANTES DE TAMAÑO
 * ----------------------------------------------------------- */
const sizeVariants = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-xl',
  xl: 'max-w-2xl',
  full: 'w-[85vw] h-[80vh] max-w-none max-h-none px-4 md:px-8 overflow-hidden'
} as const

/* -------------------------------------------------------------
 *  PROPS
 * ----------------------------------------------------------- */
export function Modal({
  title,
  description,
  children,
  open,
  onOpenChange,
  size = 'md'
}: {
  title: string
  description?: string
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  size?: keyof typeof sizeVariants
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* -------- Overlay (fondo oscurecido) -------- */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />

        {/* -------- Contenido (ventana modal) -------- */}
        <Dialog.Content
          className={cn(
            // posicionamiento centrado
            'fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2',
            // estilo glass & animaciones (idéntico al Card)
            'rounded-lg border border-white/20 bg-white/80 backdrop-blur-md text-card-foreground shadow-xl shadow-black/10',
            // padding base
            'p-6',
            // tamaño elegido
            sizeVariants[size]
          )}
        >
          {/* -------- Header -------- */}
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
            <Dialog.Close>
              <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </Dialog.Close>
          </div>

          {/* -------- Descripción opcional -------- */}
          {description && (
            <Dialog.Description className="mb-4 text-sm text-gray-500">
              {description}
            </Dialog.Description>
          )}

          {/* -------- Contenido de usuario -------- */}
          <div>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
