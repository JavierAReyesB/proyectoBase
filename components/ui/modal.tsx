'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const sizeVariants = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-xl',
  xl: 'max-w-2xl',
  full: 'w-[85vw] h-[80vh] max-w-none max-h-none px-4 md:px-8 overflow-hidden'
} as const

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
  const isFull = size === 'full'

  const [vh, setVh] = React.useState<number | null>(null)
  React.useEffect(() => {
    const update = () => {
      const h = (window.visualViewport?.height ?? window.innerHeight) || 0
      setVh(h)
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', update)
      window.visualViewport.addEventListener('scroll', update)
    }
    requestAnimationFrame(update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', update)
        window.visualViewport.removeEventListener('scroll', update)
      }
    }
  }, [])

  const fullHeightPx = vh ? Math.round(vh * 0.8) : undefined
  const maxBodyPx = vh ? Math.round(vh * 0.8) : undefined

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* -------- Overlay (fondo oscurecido) -------- */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />

        {/* -------- Contenido (ventana modal) -------- */}
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2',
            'rounded-lg border border-white/20 bg-white/80 backdrop-blur-md text-card-foreground shadow-xl shadow-black/10',
            'p-6',
            sizeVariants[size],
            'flex flex-col'
          )}
          style={isFull && fullHeightPx ? { height: `${fullHeightPx}px` } : undefined}
        >
          {/* -------- Header -------- */}
          <div className="mb-4 flex items-center justify-between shrink-0">
            <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
            <Dialog.Close>
              <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </Dialog.Close>
          </div>

          {/* -------- Descripción opcional -------- */}
          {description && (
            <Dialog.Description className="mb-4 text-sm text-gray-500 shrink-0">
              {description}
            </Dialog.Description>
          )}

          {/* -------- Contenido de usuario (scroll interno cuando haga falta) -------- */}
          <div
            className={cn(
              isFull
                ? 'flex-1 min-h-0 overflow-y-auto'
                : 'overflow-y-auto' 
            )}
            style={{
              ...( !isFull && maxBodyPx ? { maxHeight: `${maxBodyPx}px` } : null ),
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain'
            }}
          >
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
