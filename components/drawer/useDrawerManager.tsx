// useDrawerManager.ts
'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { DrawerState, DrawerSize } from './drawerTypes'
import type { MinimizedDrawerInfo } from './drawerTypes'

// 🔄 Reconstruir contenido ReactNode a partir de contentKey + contentData
function rebuildContentFromData(key: string, data: any): React.ReactNode {
  if (key === 'project') {
    return <pre style={{ padding: 8 }}>{JSON.stringify(data, null, 2)}</pre>
  }
  if (key === 'trabajo') {
    return <pre style={{ padding: 8 }}>{JSON.stringify(data?.trabajo ?? data, null, 2)}</pre>
  }
  return <div>Contenido no disponible</div>
}

export function useDrawerManager() {
  const [openDrawers, setOpenDrawers] = useState<DrawerState[]>([])
  const [minimizedDrawers, setMinimizedDrawers] = useState<DrawerState[]>([])

  const hasRestoredOpen = useRef(false)
  const hasRestoredMin = useRef(false)

  // 1️⃣ Hidratar openDrawers
  useEffect(() => {
    try {
      const raw = localStorage.getItem('openDrawers')
      if (raw) {
        const parsed = JSON.parse(raw) as MinimizedDrawerInfo[]
        const restored = parsed.map(d => ({
          ...d,
          content: rebuildContentFromData(d.contentKey, d.contentData)
        }))
        setOpenDrawers(restored)
      }
    } catch (err) {
      console.error('⚠️ Error al hidratar openDrawers:', err)
    } finally {
      hasRestoredOpen.current = true
    }
  }, [])

  // 2️⃣ Hidratar minimizedDrawers
  useEffect(() => {
    try {
      const raw = localStorage.getItem('minimizedDrawers')
      if (raw) {
        const parsed = JSON.parse(raw) as MinimizedDrawerInfo[]
        const restored = parsed.map(d => ({
          ...d,
          content: rebuildContentFromData(d.contentKey, d.contentData)
        }))
        setMinimizedDrawers(restored)
      }
    } catch (err) {
      console.error('⚠️ Error al hidratar minimizedDrawers:', err)
    } finally {
      hasRestoredMin.current = true
    }
  }, [])

  // 🔐 Utilidad para serializar un array de drawers
  const serialize = (drawers: DrawerState[]) =>
    drawers.map(
      ({ id, title, width, isPinned, instanceId, contentKey, contentData }) => ({
        id,
        title: typeof title === 'string' ? title : '',
        width,
        isPinned,
        icon: null,
        instanceId,
        contentKey,
        contentData
      })
    )

  // 3️⃣ Guardar openDrawers
  useEffect(() => {
    if (!hasRestoredOpen.current) return
    localStorage.setItem('openDrawers', JSON.stringify(serialize(openDrawers)))
  }, [openDrawers])

  // 4️⃣ Guardar minimizedDrawers
  useEffect(() => {
    if (!hasRestoredMin.current) return
    localStorage.setItem('minimizedDrawers', JSON.stringify(serialize(minimizedDrawers)))
  }, [minimizedDrawers])

  // 🆕 updateDrawer: refresca y persiste de inmediato
  const updateDrawer = useCallback((id: string, updates: Partial<DrawerState>) => {
    setOpenDrawers(prev => {
      const next = prev.map(d => (d.id === id ? { ...d, ...updates } : d))
      // Persistir al vuelo
      try {
        localStorage.setItem('openDrawers', JSON.stringify(serialize(next)))
      } catch (err) {
        console.error('⚠️ Error al guardar updateDrawer:', err)
      }
      return next
    })
  }, [])

  // ✅ openDrawer con reemplazo si ya existe
  const openDrawer = useCallback((drawer: DrawerState) => {
    setOpenDrawers(prev => {
      const exists = prev.find(d => d.id === drawer.id)
      const next = exists ? prev.map(d => (d.id === drawer.id ? drawer : d)) : [...prev, drawer]
      if (hasRestoredOpen.current) {
        localStorage.setItem('openDrawers', JSON.stringify(serialize(next)))
      }
      return next
    })
  }, [])

  const closeDrawer = useCallback((id: string) => {
    setOpenDrawers(prev => prev.filter(d => d.id !== id))
    setMinimizedDrawers(prev => prev.filter(d => d.id !== id))
  }, [])

  const minimizeDrawer = useCallback((drawer: DrawerState) => {
    setOpenDrawers(prev => prev.filter(d => d.id !== drawer.id))
    setMinimizedDrawers(prev => [...prev, drawer])
  }, [])

  const restoreDrawer = useCallback(
    (id: string) => {
      setMinimizedDrawers(prev => {
        const target = prev.find(d => d.id === id)
        if (!target) return prev
        openDrawer(target)
        return prev.filter(d => d.id !== id)
      })
    },
    [openDrawer]
  )

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

  // 5️⃣ Agrupar minimizados para la barra
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
    updateDrawer,
    closeDrawer,
    minimizeDrawer,
    restoreDrawer,
    resizeDrawer,
    pinDrawer,
    groupedMinimizedDrawers
  }
}
