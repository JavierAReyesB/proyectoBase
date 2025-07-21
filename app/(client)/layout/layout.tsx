// app/(client)/layout.tsx
'use client'

import React from 'react'
import ChromeWrapper from '@/app/ChromeWrapper'
import { Providers } from '@/components/Providers'
import { DrawerProvider } from '@/components/drawer/DrawerProvider'
import DrawerOverlay from '@/components/drawer/DrawerOverlay'
import './globals.css'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChromeWrapper defaultOpen={true /* o tu cookie */}>
      <Providers>
        <DrawerProvider>
          {children}
          <DrawerOverlay />
        </DrawerProvider>
      </Providers>
    </ChromeWrapper>
  )
}
