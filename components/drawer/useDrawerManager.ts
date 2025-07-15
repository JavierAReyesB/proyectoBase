'use client'

import { useState, useCallback } from 'react'
import type { DrawerState, DrawerSize } from './drawerTypes'
import type { MinimizedDrawerInfo } from './MinimizedDrawersBar'

export function useDrawerManager() {
  const [openDrawers, setOpenDrawers] = useState<DrawerState[]>([])
  const [minimizedDrawers, setMinimizedDrawers] = useState<DrawerState[]>([])

  /** Abrir un nuevo drawer si no está abierto */
  const openDrawer = useCallback((drawer: DrawerState) => {
    setOpenDrawers((prev) => {
      const exists = prev.find((d) => d.id === drawer.id)
      return exists ? prev : [...prev, drawer]
    })
  }, [])

  /** Cerrar completamente (de abierto y minimizado) */
  const closeDrawer = useCallback((id: string) => {
    setOpenDrawers((prev) => prev.filter((d) => d.id !== id))
    setMinimizedDrawers((prev) => prev.filter((d) => d.id !== id))
  }, [])

  /** Minimizar un drawer pasando su objeto completo */
  const minimizeDrawer = useCallback((drawer: DrawerState) => {
    setOpenDrawers((prev) => prev.filter((d) => d.id !== drawer.id))
    setMinimizedDrawers((prev) => [...prev, drawer])
  }, [])

  /** Restaurar desde la barra inferior */
  const restoreDrawer = useCallback((id: string) => {
    setMinimizedDrawers((prev) => {
      const target = prev.find((d) => d.id === id)
      if (!target) return prev
      setOpenDrawers((open) => [...open, target])
      return prev.filter((d) => d.id !== id)
    })
  }, [])

  /** Agrupación para la MinimizedDrawersBar */
  const groupedMinimizedDrawers: Map<string, MinimizedDrawerInfo[]> = new Map()

  for (const drawer of minimizedDrawers) {
    const groupKey = typeof drawer.title === 'string' ? drawer.title : 'Otros'
    const group = groupedMinimizedDrawers.get(groupKey) || []
    group.push({
      id: drawer.id,
      title: drawer.title,
      width: drawer.width,
      isPinned: drawer.isPinned,
      icon: drawer.icon,
      instanceId: drawer.instanceId
    })
    groupedMinimizedDrawers.set(groupKey, group)
  }

  return {
    openDrawers,
    openDrawer,
    closeDrawer,
    minimizeDrawer,
    restoreDrawer,
    groupedMinimizedDrawers
  }
}
