// components/drawer/DrawerOverlay.tsx
'use client'

import React, { useContext, useEffect, useRef } from 'react'
import { useDrawerContext } from './DrawerProvider'
import { GenericDrawer } from './GenericDrawer'
import { MinimizedDrawersBar } from './MinimizedDrawersBar'
import type { DrawerState } from './drawerTypes'
import { TableContext } from '@/components/TableContext'

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
      console.log('tabla rect:', r)           // ← verifica en consola

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
      window.addEventListener('scroll', makeHole, true) // scrolls anidados
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

  /* ───────── Cerrar drawer al hacer clic fuera ───────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!openDrawers.some(d => d.id === 'drawer-trabajo')) return
      const target = e.target as HTMLElement
      if (target.closest('[data-drawer="true"]')) return
      if (tableRef?.current?.contains(target)) return
      closeDrawer('drawer-trabajo')
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [openDrawers, tableRef, closeDrawer])

  /* ───────── Render ───────── */
  return (
    <>
    
      {openDrawers.map((d: DrawerState, idx) => (
        <GenericDrawer
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
