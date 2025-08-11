'use client'

import React, { createContext, useContext } from 'react'
import { useDrawerManager } from './useDrawerManager'

/** Alias de tipo útil si lo necesitas en otros archivos */
export type DrawerManager = ReturnType<typeof useDrawerManager>

/**
 * Contexto para manejar drawers globales (minimizados, restaurados, cerrados).
 * Mantiene el tipado estricto y lanza error si se usa fuera del Provider.
 */
export const DrawerContext = createContext<DrawerManager | undefined>(undefined)
DrawerContext.displayName = 'DrawerContext'

/** Props del Provider */
export interface DrawerProviderProps {
  children: React.ReactNode
}

/**
 * Proveedor de contexto para los drawers.
 * No altera ninguna funcionalidad existente: solo expone el manager vía contexto.
 */
export const DrawerProvider = ({ children }: DrawerProviderProps) => {
  const drawerManager = useDrawerManager()
  return (
    <DrawerContext.Provider value={drawerManager}>
      {children}
    </DrawerContext.Provider>
  )
}

/**
 * Hook para acceder al contexto de drawers.
 * Lanza un error claro si se usa fuera del Provider.
 */
export const useDrawerContext = (): DrawerManager => {
  const ctx = useContext(DrawerContext)
  if (!ctx) {
    throw new Error('useDrawerContext must be used within a DrawerProvider')
  }
  return ctx
}
