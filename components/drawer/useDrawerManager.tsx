'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { DrawerState, DrawerSize } from './drawerTypes'
import type { MinimizedDrawerInfo } from './drawerTypes'

function rebuildContentFromData(key: string, data: any): React.ReactNode {
  switch (key) {
    case 'contrato':
      return <pre style={{ padding: 8 }}>{JSON.stringify(data, null, 2)}</pre>

    case 'dashboard-card':
      return (
        <p>
          {data.title}: {data.value} ({data.badge})
        </p>
      )

    /* otros tipos que necesites… */
    default:
      return <div>Contenido no disponible</div>
  }
}

export function useDrawerManager() {
  const [openDrawers, setOpenDrawers] = useState<DrawerState[]>([])
  const [minimizedDrawers, setMinimizedDrawers] = useState<DrawerState[]>([])

  const hasRestoredOpen = useRef(false)
  const hasRestoredMin = useRef(false)
  const isReady = hasRestoredOpen.current && hasRestoredMin.current

  // ✅ Helper que solo permite actualizar si ya se restauró
  const safeSetMinimizedDrawers = useCallback((updater: (prev: DrawerState[]) => DrawerState[]) => {
    if (!hasRestoredMin.current) {
      console.warn('⛔️ Evitando setMinimizedDrawers antes de restaurar')
      return
    }
    setMinimizedDrawers(updater)
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('openDrawers')
      if (raw) {
        const parsed = JSON.parse(raw) as MinimizedDrawerInfo[]
        const restored = parsed.map(d => ({
          ...d,
          content: rebuildContentFromData(d.contentKey, d.contentData)
        }))
        console.log('📥 Hidratar openDrawers:', restored)
        setOpenDrawers(restored)
      }
    } catch (err) {
      console.error('⚠️ Error al hidratar openDrawers:', err)
    } finally {
      hasRestoredOpen.current = true
    }
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('minimizedDrawers')
      if (raw) {
        const parsed = JSON.parse(raw) as MinimizedDrawerInfo[]
        const restored = parsed.map(d => ({
          ...d,
          content: rebuildContentFromData(d.contentKey, d.contentData)
        }))
        console.log('📥 Hidratar minimizedDrawers:', restored)
        setMinimizedDrawers(restored)
      }
    } catch (err) {
      console.error('⚠️ Error al hidratar minimizedDrawers:', err)
    } finally {
      hasRestoredMin.current = true
    }
  }, [])

  useEffect(() => {
    if (!hasRestoredOpen.current) return
    const serializable = openDrawers.map(({ id, title, width, isPinned, icon, instanceId, contentKey, contentData }) => ({
      id,
      title: typeof title === 'string' ? title : '',
      width,
      isPinned,
      icon: null,
      instanceId,
      contentKey,
      contentData
    }))
    console.log('💾 Guardando openDrawers:', serializable)
    localStorage.setItem('openDrawers', JSON.stringify(serializable))
  }, [openDrawers])

  useEffect(() => {
    if (!hasRestoredMin.current) return
    const serializable = minimizedDrawers.map(({ id, title, width, isPinned, icon, instanceId, contentKey, contentData }) => ({
      id,
      title: typeof title === 'string' ? title : '',
      width,
      isPinned,
      icon: null,
      instanceId,
      contentKey,
      contentData
    }))
    console.log('💾 Guardando minimizedDrawers:', serializable)
    localStorage.setItem('minimizedDrawers', JSON.stringify(serializable))
  }, [minimizedDrawers])

  // 👇 Estas funciones ahora usan el "safe setter"
  const openDrawer = useCallback((drawer: DrawerState) => {
    setOpenDrawers(prev => (prev.find(d => d.id === drawer.id) ? prev : [...prev, drawer]))
  }, [])

  const closeDrawer = useCallback((id: string) => {
    setOpenDrawers(prev => prev.filter(d => d.id !== id))
    safeSetMinimizedDrawers(prev => prev.filter(d => d.id !== id))
  }, [safeSetMinimizedDrawers])

  const minimizeDrawer = useCallback((drawer: DrawerState) => {
    setOpenDrawers(prev => prev.filter(d => d.id !== drawer.id))
    safeSetMinimizedDrawers(prev => [...prev, drawer])
  }, [safeSetMinimizedDrawers])

  const restoreDrawer = useCallback((id: string) => {
    safeSetMinimizedDrawers(prev => {
      const target = prev.find(d => d.id === id)
      if (!target) return prev
      openDrawer(target)
      return prev.filter(d => d.id !== id)
    })
  }, [openDrawer, safeSetMinimizedDrawers])

  const resizeDrawer = useCallback((id: string, width: DrawerSize) => {
    setOpenDrawers(prev => prev.map(d => (d.id === id ? { ...d, width } : d)))
  }, [])

  const pinDrawer = useCallback((id: string, isPinned: boolean) => {
    setOpenDrawers(prev => prev.map(d => (d.id === id ? { ...d, isPinned } : d)))
  }, [])

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
      instanceId: d.instanceId,
      contentKey: d.contentKey,
      contentData: d.contentData
    })
    groupedMinimizedDrawers.set(key, group)
  }

  return {
    openDrawers,
    openDrawer,
    closeDrawer,
    minimizeDrawer,
    restoreDrawer,
    resizeDrawer,
    pinDrawer,
    groupedMinimizedDrawers,
    isReady,
  }
}
