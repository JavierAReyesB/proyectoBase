'use client'

import { useState, useCallback, useEffect } from 'react'
import type { DrawerState, DrawerSize } from './drawerTypes'
import type { MinimizedDrawerInfo } from './drawerTypes'

export function useDrawerManager() {
  const [openDrawers, setOpenDrawers] = useState<DrawerState[]>([])
  const [minimizedDrawers, setMinimizedDrawers] = useState<DrawerState[]>([])
  const [hydrated, setHydrated] = useState(false)

  // 1) Al montar en cliente, rehidrato desde sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('minimizedDrawers')
      if (raw) {
        const arr = JSON.parse(raw) as DrawerState[]
        setMinimizedDrawers(arr)
      }
    } catch {
      // nada si falla
    } finally {
      setHydrated(true)
    }
  }, [])

  // 2) Cada vez que cambian los minimizados (ya hidratado), persisto
  useEffect(() => {
    if (!hydrated) return
    // sólo guardamos la parte serializable
    const serializable = minimizedDrawers.map(({ id, title, width, isPinned, icon, instanceId }) => ({
      id, title, width, isPinned, icon, instanceId
    }))
    sessionStorage.setItem('minimizedDrawers', JSON.stringify(serializable))
  }, [hydrated, minimizedDrawers])

  const openDrawer = useCallback((drawer: DrawerState) => {
    setOpenDrawers(prev =>
      prev.find(d => d.id === drawer.id) ? prev : [...prev, drawer]
    )
  }, [])

  const closeDrawer = useCallback((id: string) => {
    setOpenDrawers(prev => prev.filter(d => d.id !== id))
    setMinimizedDrawers(prev => prev.filter(d => d.id !== id))
  }, [])

  const minimizeDrawer = useCallback((drawer: DrawerState) => {
    setOpenDrawers(prev => prev.filter(d => d.id !== drawer.id))
    setMinimizedDrawers(prev => [...prev, drawer])
  }, [])

  const restoreDrawer = useCallback((id: string) => {
    setMinimizedDrawers(prev => {
      const target = prev.find(d => d.id === id)
      if (!target) return prev
      openDrawer(target)
      return prev.filter(d => d.id !== id)
    })
  }, [openDrawer])

  const resizeDrawer = useCallback((id: string, width: DrawerSize) => {
    setOpenDrawers(prev =>
      prev.map(d => (d.id === id ? { ...d, width } : d))
    )
  }, [])

  const pinDrawer = useCallback((id: string, isPinned: boolean) => {
    setOpenDrawers(prev =>
      prev.map(d => (d.id === id ? { ...d, isPinned } : d))
    )
  }, [])

  // Agrupación para la barra de minimizados
  const groupedMinimizedDrawers = new Map<string, MinimizedDrawerInfo[]>()
  for (const d of minimizedDrawers) {
    const key = typeof d.title === 'string' ? d.title : 'Otros'
    const group = groupedMinimizedDrawers.get(key) || []
    group.push({
      id: d.id,
      title: d.title,
      width: d.width,
      isPinned: d.isPinned,
      icon: d.icon,
      instanceId: d.instanceId
    })
    groupedMinimizedDrawers.set(key, group)
  }

  return {
    // para el overlay
    hydrated,
    openDrawers,
    minimizeDrawer,
    closeDrawer,
    restoreDrawer,
    resizeDrawer,
    pinDrawer,
    groupedMinimizedDrawers,
    // para quien abra un drawer
    openDrawer
  }
}
