// components/drawer/DrawerOverlay.tsx
'use client'

import React, { useContext, useEffect, useRef } from 'react'
import { useDrawerContext } from './DrawerProvider'
import { GenericDrawer } from './GenericDrawer'
import { MinimizedDrawersBar } from './MinimizedDrawersBar'
import type { DrawerState } from './drawerTypes'
import { TableContext } from '@/components/TableContext'

declare global {
  interface Window {
    __skipNextDrawerOutsideClose?: boolean
  }
}

export default function DrawerOverlay() {
  const {
    openDrawers,
    minimizeDrawer,
    closeDrawer,
    restoreDrawer,
    resizeDrawer,
    pinDrawer,
    groupedMinimizedDrawers
  } = useDrawerContext()

  const mainDrawerRef = useRef<HTMLDivElement>(null)
  const tableRef      = useContext(TableContext)

  /* ───────── Mostrar / ocultar dim ───────── */
  const showDim = openDrawers.some(
    d => d.id === 'drawer-trabajo' && d.width !== 'full'
  )

  /* ───────── Calcular clip-path ───────── */
  useEffect(() => {
    const cls = 'drawer-dim'

    const makeHole = () => {
      if (!tableRef?.current) return
      const r = tableRef.current.getBoundingClientRect()

      const top    = r.top  + window.scrollY
      const left   = r.left + window.scrollX
      const right  = left + r.width
      const bottom = top  + r.height

      const clip = `
        polygon(
          0 0,
          100vw 0,
          100vw 100vh,
          0 100vh,
          0 ${top}px,
          ${left}px ${top}px,
          ${right}px ${top}px,
          ${right}px ${bottom}px,
          ${left}px ${bottom}px,
          0 ${bottom}px
        )`
      document.body.style.setProperty('--clip-table', clip)
    }

    if (showDim) {
      document.body.classList.add(cls)
      requestAnimationFrame(makeHole)
      window.addEventListener('resize', makeHole)
      window.addEventListener('scroll', makeHole, true)
    } else {
      document.body.classList.remove(cls)
      document.body.style.removeProperty('--clip-table')
      window.removeEventListener('resize', makeHole)
      window.removeEventListener('scroll', makeHole, true)
    }

    return () => {
      document.body.classList.remove(cls)
      document.body.style.removeProperty('--clip-table')
      window.removeEventListener('resize', makeHole)
      window.removeEventListener('scroll', makeHole, true)
    }
  }, [showDim, tableRef])

  /* ───────── Helpers Radix Popper ───────── */
  const isInsideRadixPopper = (target: EventTarget | null, path?: EventTarget[]) => {
    const match = (el: EventTarget | null) =>
      el instanceof HTMLElement &&
      !!el.closest?.('[data-radix-popper-content-wrapper]')

    if (match(target)) return true
    if (Array.isArray(path)) for (const el of path) if (match(el)) return true
    return false
  }

  const hasOpenRadixPopper = () =>
    !!(
      document.querySelector('[data-radix-popper-content-wrapper] [data-state="open"]') ||
      document.querySelector('[data-radix-popper-content-wrapper]')
    )

  /* ───────── Marca en pointerdown (captura) si el gesto empieza con popper activo ───────── */
  useEffect(() => {
    const onPointerDownCapture = (e: PointerEvent) => {
      // Solo si el drawer principal está abierto
      if (!openDrawers.some(d => d.id === 'drawer-trabajo')) return

      const path = (e.composedPath?.() as EventTarget[]) ?? undefined

      // Si el gesto comienza dentro del popper o había popper abierto en PD → marcar
      if (isInsideRadixPopper(e.target, path) || hasOpenRadixPopper()) {
        window.__skipNextDrawerOutsideClose = true
      }
    }

    document.addEventListener('pointerdown', onPointerDownCapture, true)
    return () => document.removeEventListener('pointerdown', onPointerDownCapture, true)
  }, [openDrawers])

  /* ───────── Cerrar drawer al hacer clic fuera (aware + flag) ───────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // Solo si el drawer principal está abierto
      if (!openDrawers.some(d => d.id === 'drawer-trabajo')) return

      // Si el PD venía de interacción con popper → saltar este cierre
      if (window.__skipNextDrawerOutsideClose) {
        window.__skipNextDrawerOutsideClose = false
        return
      }

      const path = (typeof e.composedPath === 'function'
        ? (e.composedPath() as EventTarget[])
        : []
      ).filter(Boolean) as HTMLElement[]

      const target = e.target as HTMLElement

      // Clic dentro del popper de Radix → no cerrar
      if (isInsideRadixPopper(target, path)) return

      // Clic dentro de cualquier drawer (root con data-drawer="true")
      const insideDrawer = path.some(
        el => el instanceof HTMLElement && el.dataset?.drawer === 'true'
      )
      if (insideDrawer) return

      // Clic dentro de portal propio del drawer (si lo marcas con data-drawer-portal)
      const insideDrawerPortal = path.some(
        el => el instanceof HTMLElement && el.dataset?.drawerPortal === 'true'
      )
      if (insideDrawerPortal) return

      // Clic dentro de la tabla (el "agujero" del dim)
      if (tableRef?.current && (tableRef.current === target || tableRef.current.contains(target))) {
        return
      }

      // Todo lo demás => cerrar el drawer principal no fijado
      const top = openDrawers[openDrawers.length - 1]
      if (top && !top.isPinned) closeDrawer('drawer-trabajo')
    }

    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler, true)
  }, [openDrawers, tableRef, closeDrawer])

  /* ───────── Render ───────── */
  return (
    <>
      {openDrawers.map((d: DrawerState, idx) => (
        <GenericDrawer
          data-drawer="true"
          ref={d.id === 'drawer-trabajo' ? mainDrawerRef : undefined}
          key={d.id}
          title={d.title}
          visible
          isSecondDrawer={idx > 0}
          width={d.width}
          instanceId={d.instanceId}
          icon={d.icon}
          hideBackdrop={d.hideBackdrop}
          contentKey={d.contentKey}
          contentData={d.contentData}
          onMinimize={() => minimizeDrawer(d)}
          onClose={() => closeDrawer(d.id)}
          toggleSize={() =>
            resizeDrawer(d.id, d.width === 'full' ? 'half' : 'full')
          }
          onPin={p => pinDrawer(d.id, p)}
        >
          {d.content}
        </GenericDrawer>
      ))}

      <MinimizedDrawersBar
        groupedDrawers={groupedMinimizedDrawers}
        onRestoreIndividual={restoreDrawer}
        onCloseIndividual={closeDrawer}
      />
    </>
  )
}
