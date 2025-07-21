// components/Providers.tsx
'use client'

import React from 'react'
import { DrawerProvider } from './drawer/DrawerProvider'
import DrawerOverlay from './drawer/DrawerOverlay'

export function Providers({ children }: { children: React.ReactNode }) {
  console.log('📦 [Providers] montado y vivo durante toda la navegación')
  return (
    <DrawerProvider>
      {children}
      <DrawerOverlay />
    </DrawerProvider>
  )
}
