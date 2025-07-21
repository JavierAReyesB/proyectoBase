// app/(client)/layout.tsx
'use client'

import React from 'react'
import ChromeWrapper from '@/app/ChromeWrapper'
import { Providers } from '@/components/Providers'
import { DrawerProvider } from '@/components/drawer/DrawerProvider'
import DrawerOverlay from '@/components/drawer/DrawerOverlay'

export default function ClientLayout({
  children,
  defaultOpen
}: {
  children: React.ReactNode
  defaultOpen: boolean
}) {
  return (
    <ChromeWrapper defaultOpen={false}>
      <Providers>
        <DrawerProvider>
          {children}
          <DrawerOverlay />
        </DrawerProvider>
      </Providers>
    </ChromeWrapper>
  )
}
