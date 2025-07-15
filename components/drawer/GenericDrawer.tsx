'use client'

import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, Pin, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FilterSwitch } from '@/components/ui/switch'
import { Spin } from '@/components/ui/spin'
import { cn } from '@/lib/utils'
import { useDrawerContext } from './DrawerProvider'

type DrawerSize = 'quarter' | 'third' | 'half' | 'full'

interface GenericDrawerProps {
  /* Obligatorios */
  title: React.ReactNode
  visible: boolean
  onClose: () => void

  /* Contenido */
  children?: React.ReactNode
  footer?: React.ReactNode
  loading?: boolean
  contentClassName?: string

  /* Anchura */
  width?: DrawerSize
  toggleSize?: () => void

  /* Comportamiento */
  isSecondDrawer?: boolean
  onPin?: (pinned: boolean) => void
  onMinimize?: () => void
  hideBackdrop?: boolean
  onOpen?: () => void

  /* Extras en header */
  headerActions?: React.ReactNode

  /* Icono e instancia opcionales para minimizado */
  instanceId?: string
  icon?: React.ReactNode
}

/* ------------------------------ Z-INDEX ---------------------------------- */
/* Cada cajón parte de su “base”, y suma extras según su estado:            */
/*   – base 1000  → cajón derecho                                           */
/*   – base 2000  → cajón izquierdo                                         */
/*   – +3000      → si se expande a full-width                              */
/*   – + 500      → si está fijado (“pinned”)                               */
const Z_RIGHT_BASE = 1000
const Z_LEFT_BASE = 2000
const BONUS_FULL = 3000
const BONUS_PINNED = 500
/* ------------------------------------------------------------------------ */

export function GenericDrawer({
  title,
  visible,
  onClose,
  children,
  loading = false,
  width: externalWidth = 'half',
  toggleSize,
  onMinimize,
  isSecondDrawer = false,
  onPin,
  footer,
  hideBackdrop = false,
  contentClassName,
  onOpen,
  headerActions,
  instanceId,
  icon
}: GenericDrawerProps) {
  const [internalWidth, setInternalWidth] = useState<DrawerSize>('half')
  const [isPinned, setIsPinned] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const drawerContext = useDrawerContext()

  /* Anchura */
  const currentWidth = externalWidth || internalWidth
  const isFullWidth = currentWidth === 'full'

  /* ------------- Cálculo unificado de la pila (z-index) ------------------ */
  const baseZ = isSecondDrawer ? Z_LEFT_BASE : Z_RIGHT_BASE
  const drawerZ =
    baseZ + (isFullWidth ? BONUS_FULL : 0) + (isPinned ? BONUS_PINNED : 0)
  const backdropZ = drawerZ - 1
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 840)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const firstOpen = useRef(false)
  useEffect(() => {
    if (visible && !firstOpen.current) {
      firstOpen.current = true
      onOpen?.()
    }
  }, [visible, onOpen])

  const handleSizeToggle = () =>
    toggleSize
      ? toggleSize()
      : setInternalWidth((p) => (p === 'full' ? 'half' : 'full'))

  const handlePin = () => {
    const next = !isPinned
    setIsPinned(next)
    onPin?.(next)
  }

  const handleMinimize = () => {
    if (!drawerContext) return
    drawerContext.minimizeDrawer({
      id: `${Date.now()}-${Math.random()}`,
      title,
      content: children,
      width: currentWidth,
      isPinned,
      icon,
      instanceId
    })
    onClose()
  }

  if (!visible) return null

  /* Tailwind solo controla la anchura y los bordes; el z-index es inline */
  const drawerNode = (
    <div
      className={cn(
        'fixed top-0 bottom-0 bg-background shadow-lg transition-all duration-300 ease-in-out flex flex-col',
        isSecondDrawer ? 'left-0 border-r' : 'right-0 border-l',
        /* ancho responsivo */
        isMobile
          ? 'w-full'
          : isSecondDrawer
          ? isFullWidth
            ? 'w-full'
            : 'w-1/2'
          : isPinned
          ? isFullWidth
            ? 'w-full'
            : 'w-1/2'
          : isFullWidth
          ? 'w-full'
          : 'w-[70%]'
      )}
      style={{ zIndex: drawerZ }}
    >
      {/* header: controles */}
      <div className='sticky top-0 z-20 flex items-center justify-end gap-4 p-2 border-b bg-background'>
        {onPin && (
          <Button
            size='sm'
            variant='ghost'
            onClick={handlePin}
            className='h-8 w-8 p-0'
          >
            <Pin className={cn('h-4 w-4', isPinned && 'text-primary')} />
          </Button>
        )}

        {!isMobile && (
          <FilterSwitch
            id='size-toggle'
            checked={isFullWidth}
            onCheckedChange={handleSizeToggle}
          />
        )}

        {/* botón de minimizar */}
        {onMinimize || drawerContext ? (
          <Button
            size='sm'
            variant='ghost'
            onClick={onMinimize || handleMinimize}
            className='h-8 w-8 p-0'
          >
            <Minimize2 className='h-4 w-4' />
          </Button>
        ) : null}

        {headerActions && (
          <div className='flex items-center'>{headerActions}</div>
        )}

        <Button
          size='sm'
          variant='ghost'
          onClick={onClose}
          className='h-8 w-8 p-0'
        >
          <X className='h-4 w-4' />
        </Button>
      </div>

      {/* header: título */}
      <div className='flex items-center p-4 border-b bg-muted/50'>
        {typeof title === 'string' ? (
          <h2 className='text-lg font-semibold truncate flex-1'>{title}</h2>
        ) : (
          <div className='flex-1 min-w-0'>{title}</div>
        )}
      </div>

      {/* contenido */}
      <div className={cn('flex-1 overflow-auto p-4', contentClassName)}>
        {loading ? (
          <div className='flex items-center justify-center h-full'>
            <Spin size='lg' />
          </div>
        ) : (
          children
        )}
      </div>

      {/* footer */}
      {footer && <div className='border-t bg-muted/50 p-4'>{footer}</div>}
    </div>
  )

  const root = document.getElementById('drawer-root')
  if (!root) return null

  return createPortal(
    <>
      {!hideBackdrop && !isPinned && !isSecondDrawer && !isFullWidth && (
        <div
          className='fixed inset-0 bg-black/50 transition-opacity duration-300'
          style={{ zIndex: backdropZ }}
          onClick={onClose}
        />
      )}
      {drawerNode}
    </>,
    root
  )
}
