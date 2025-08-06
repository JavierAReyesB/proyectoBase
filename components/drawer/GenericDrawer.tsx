'use client'

import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  type Ref
} from 'react'
import { createPortal } from 'react-dom'
import { X, Pin, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FilterSwitch } from '@/components/ui/switch'
import { Spin } from '@/components/ui/spin'
import { cn } from '@/lib/utils'
import { useDrawerContext } from './DrawerProvider'

type DrawerSize = 'quarter' | 'third' | 'half' | 'full'

export interface GenericDrawerProps {
  title: React.ReactNode
  visible: boolean
  onClose: () => void
  children?: React.ReactNode
  footer?: React.ReactNode
  loading?: boolean
  contentClassName?: string
  width?: DrawerSize
  toggleSize?: () => void
  isSecondDrawer?: boolean
  onPin?: (pinned: boolean) => void
  onMinimize?: () => void
  hideBackdrop?: boolean
  onOpen?: () => void
  headerActions?: React.ReactNode
  instanceId?: string
  icon?: React.ReactNode
  contentKey: string
  contentData: any
}

const Z_RIGHT_BASE = 1000
const Z_LEFT_BASE = 2000
const BONUS_FULL = 3000
const BONUS_PINNED = 500

/* -------------------------------------------------------
   Componente interno que acepta forwardRef
------------------------------------------------------- */
function GenericDrawerInner(
  {
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
    icon,
    contentKey,
    contentData
  }: GenericDrawerProps,
  ref: Ref<HTMLDivElement>
) {
  const [internalWidth, setInternalWidth] = useState<DrawerSize>('half')
  const [isPinned, setIsPinned] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const drawerContext = useDrawerContext()

  /* Anchura y z-index ---------------------------------- */
  const currentWidth = externalWidth || internalWidth
  const isFullWidth = currentWidth === 'full'
  const baseZ = isSecondDrawer ? Z_LEFT_BASE : Z_RIGHT_BASE
  const drawerZ =
    baseZ + (isFullWidth ? BONUS_FULL : 0) + (isPinned ? BONUS_PINNED : 0)
  const backdropZ = drawerZ - 1

  /* Responsive móvil ----------------------------------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 840)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  /* onOpen solo la 1.ª vez ------------------------------ */
  const firstOpen = useRef(false)
  useEffect(() => {
    if (visible && !firstOpen.current) {
      firstOpen.current = true
      onOpen?.()
    }
  }, [visible, onOpen])

  /* Handlers ------------------------------------------- */
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
      instanceId,
      contentKey,
      contentData
    })
    onClose()
  }

  if (!visible) return null

  /* Nodo del drawer ------------------------------------ */
  const drawerNode = (
    <div
      ref={ref} /* ← ref expuesto a DrawerOverlay */
       data-drawer="true" 
      className={cn(
        'fixed top-0 bottom-0 border border-white/20 bg-white/95 backdrop-blur-md text-card-foreground shadow-xl shadow-black/10 transition-all duration-300 flex flex-col',
        isSecondDrawer ? 'left-0 border-r' : 'right-0 border-l',
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
      {/* Header: acciones */}
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
        <Button
          size='sm'
          variant='ghost'
          onClick={onMinimize || handleMinimize}
          className='h-8 w-8 p-0'
        >
          <Minimize2 className='h-4 w-4' />
        </Button>
        {headerActions && <div className='flex items-center'>{headerActions}</div>}
        <Button
          size='sm'
          variant='ghost'
          onClick={onClose}
          className='h-8 w-8 p-0'
        >
          <X className='h-4 w-4' />
        </Button>
      </div>

      {/* Header: título */}
      <div className='flex items-center p-4 border-b bg-muted/50'>
        {typeof title === 'string' ? (
          <h2 className='text-lg font-semibold truncate flex-1'>{title}</h2>
        ) : (
          <div className='flex-1 min-w-0'>{title}</div>
        )}
      </div>

      {/* Contenido */}
      <div className={cn('flex-1 overflow-auto p-4', contentClassName)}>
        {loading ? (
          <div className='flex items-center justify-center h-full'>
            <Spin size='lg' />
          </div>
        ) : (
          children
        )}
      </div>

      {/* Footer */}
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

/* Exportamos con forwardRef para permitir prop ref */
export const GenericDrawer = forwardRef<HTMLDivElement, GenericDrawerProps>(
  GenericDrawerInner
)
