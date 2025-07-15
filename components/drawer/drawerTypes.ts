import type { ReactNode } from 'react'

export type DrawerSize = 'quarter' | 'third' | 'half' | 'full'

/**
 * Representa un drawer activo en pantalla.
 */
export interface DrawerState {
  id: string
  title: React.ReactNode
  content: React.ReactNode
  width: DrawerSize
  isPinned: boolean
  icon?: React.ReactNode
  instanceId?: string
}

/**
 * Representa un drawer minimizado (sin el content).
 */
export interface MinimizedDrawerInfo {
  id: string
  title: ReactNode
  width: DrawerSize
  isPinned: boolean
  icon?: ReactNode
  instanceId?: string
}
