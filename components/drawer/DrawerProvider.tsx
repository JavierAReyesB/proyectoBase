'use client'

import React, { createContext, useContext } from 'react'
import { useDrawerManager } from './useDrawerManager'

/**
 * Contexto para manejar drawers globales (minimizados, restaurados, cerrados).
 */
export const DrawerContext = createContext<ReturnType<
  typeof useDrawerManager
> | null>(null)

/**
 * Proveedor de contexto para los drawers.
 */
export const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const drawerManager = useDrawerManager()

  return (
    <DrawerContext.Provider value={drawerManager}>
      {children}
    </DrawerContext.Provider>
  )
}

/**
 * Hook para acceder al contexto de drawers.
 */
export const useDrawerContext = () => {
  const ctx = useContext(DrawerContext)
  if (!ctx) {
    throw new Error('useDrawerContext must be used within a DrawerProvider')
  }
  return ctx
}
