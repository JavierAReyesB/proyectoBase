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

/** Renderizador de header por tipo de contenido */
type DrawerHeaderRenderer = (contentData: any) => React.ReactNode
type DrawerHeaderRenderers = Record<string, DrawerHeaderRenderer>

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
  /** (Opcional) Map de renderizadores de header para extender tipos sin tocar este archivo */
  headerRenderers?: DrawerHeaderRenderers
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
    contentData,
    headerRenderers
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

  /* ---------- Render de header genérico por contentKey ---------- */

  // Fallback al título original
  const defaultTitleNode = () =>
    typeof title === 'string'
      ? <h2 className="text-lg font-semibold truncate">{title}</h2>
      : title

  // Renderizadores integrados (extiende aquí según tus tablas)
  const builtInHeaderRenderers: DrawerHeaderRenderers = {
    trabajo: (data) => {
      const t = data?.trabajo
      if (!t) return defaultTitleNode()
      return (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Trabajo #{t.id}</span>
          <span className="font-semibold text-slate-800">{t.servicio}</span>
          {t.sede && (
            <span className="text-xs text-slate-500">{t.sede}</span>
          )}
        </div>
      )
    },
    deficiencia: (data) => {
      const d = data?.def
      if (!d) return defaultTitleNode()

      // Soporte a variantes comunes de tu modelo
      const id = d.idDeficiencia ?? d.id ?? d.codigo ?? d.uid
      const titulo = d.titulo ?? d.servicio ?? d.descripcion ?? d.nombre
      const categoria =
        typeof d.categoria === 'string'
          ? d.categoria
          : d.categoria?.nombre ?? d.categoria?.label ?? d.categoria?.descripcion

      return (
        <div className="flex flex-col">
          {id && (
            <span className="text-sm text-gray-500">Deficiencia #{id}</span>
          )}
          {titulo && (
            <span className="font-semibold text-slate-800">{titulo}</span>
          )}
          {categoria && (
            <span className="text-xs text-slate-500">{categoria}</span>
          )}
        </div>
      )
    },
    aviso: (data) => {
      const a = data?.aviso
      if (!a) return defaultTitleNode()

      // ID
      const id = a.idAviso ?? a.id ?? a.codigo ?? a.uid

      // Tipo de trabajo (título). Fallbacks por si en tu modelo viene con otro nombre.
      const tipoTrabajo =
        a.tipoTrabajo ??
        a.tipoAviso ??
        (typeof a.tipo === 'string' ? a.tipo : a.tipo?.nombre ?? a.tipo?.label) ??
        a.servicio ??
        ''

      // Sede (string u objeto)
      const sede =
        typeof a.sede === 'string'
          ? a.sede
          : a.sede?.nombre ?? a.sede?.label ?? a.sede?.descripcion ?? ''

      return (
        <div className="flex flex-col">
          {id && <span className="text-sm text-gray-500">Aviso #{id}</span>}
          {tipoTrabajo && <span className="font-semibold text-slate-800">{tipoTrabajo}</span>}
          {sede && <span className="text-xs text-slate-500">{sede}</span>}
        </div>
      )
    },
    punto: (data) => {
      const p = data?.punto
      if (!p) return defaultTitleNode()

      // ID
      const id = p.idPunto ?? p.id ?? p.codigo ?? p.uid

      // Tipo / Servicio (título) — tolerante a variantes del modelo
      const tipo =
        p.tipoTrabajo ??
        p.tipo ??
        p.servicio ??
        p.categoria ??
        (typeof p.clase === 'string'
          ? p.clase
          : p.clase?.nombre ?? p.clase?.label) ??
        ''

      // Sede (string u objeto)
      const sede =
        typeof p.sede === 'string'
          ? p.sede
          : p.sede?.nombre ?? p.sede?.label ?? p.sede?.descripcion ?? ''

      return (
        <div className="flex flex-col">
          {(id || sede) && (
            <div className="flex items-center gap-2 text-sm text-slate-500 min-w-0">
              {id && <span className="shrink-0">Punto #{id}</span>}
              {id && sede && <span className="opacity-60">•</span>}
              {sede && <span className="truncate">{sede}</span>}
            </div>
          )}
          {tipo && (
            <span className="font-semibold text-slate-800">
              {tipo}
            </span>
          )}
        </div>
      )

    },




    // En builtInHeaderRenderers del GenericDrawer:
    // aviso: (data) => {
    //   const a = data?.aviso
    //   if (!a) return defaultTitleNode()
    //   return (
    //     <div className="flex flex-col">
    //       <span className="text-sm text-gray-500">Aviso #{a.idAviso}</span>
    //       {a.descripcionAviso && (
    //         <span className="font-semibold text-slate-800">{a.descripcionAviso}</span>
    //       )}
    //       {a.estadoLabel && (
    //         <span className="text-xs text-slate-500">{a.estadoLabel}</span>
    //       )}
    //     </div>
    //   )
    // }
    // ➕ Añade más tipos aquí si quieres tener defaults (aviso, contrato, cliente, etc.)
  }

  // Permite extender/override desde props sin romper nada existente
  const mergedHeaderRenderers: DrawerHeaderRenderers = {
    ...builtInHeaderRenderers,
    ...(headerRenderers || {})
  }

  const headerContent =
    mergedHeaderRenderers[contentKey]?.(contentData) ?? defaultTitleNode()

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
      {/* Header único: título + acciones */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between gap-4 p-2 border-b bg-background"
        data-drawer-header="true"
      >
        {/* Título / info */}
        <div className="flex-1 min-w-0">
          {headerContent}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2" data-drawer-controls="true">
          {onPin && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handlePin}
              className="h-8 w-8 p-0"
            >
              <Pin className={cn('h-4 w-4', isPinned && 'text-primary')} />
            </Button>
          )}
          {!isMobile && (
            <FilterSwitch
              id="size-toggle"
              checked={isFullWidth}
              onCheckedChange={handleSizeToggle}
            />
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={onMinimize || handleMinimize}
            className="h-8 w-8 p-0"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          {headerActions && <div className="flex items-center">{headerActions}</div>}
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
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
