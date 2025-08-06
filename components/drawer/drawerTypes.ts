// components/drawer/drawerTypes.ts

import type { ReactNode } from 'react'

export type DrawerSize = 'quarter' | 'third' | 'half' | 'full'

/**
 * Representa un drawer activo en pantalla.
 */
export interface DrawerState {
  id: string
  title: ReactNode
  content: ReactNode
  width: DrawerSize
  isPinned: boolean
  icon?: ReactNode
  instanceId?: string

  /** Clave para saber qué tipo de contenido reconstruir al restaurar */
  contentKey: string
  /** Datos serializables con los que se renderiza `content` */
  contentData?: any
  hideBackdrop?: boolean
}

/**
 * Representa un drawer minimizado (sin el contenido ReactNode).
 */
export interface MinimizedDrawerInfo {
  id: string
  title: ReactNode
  width: DrawerSize
  isPinned: boolean
  icon?: ReactNode
  instanceId?: string

  /** Igual que en DrawerState, para reconstruir */
  contentKey: string
  /** Igual que en DrawerState, datos serializables */
  contentData?: any
}
