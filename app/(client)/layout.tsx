'use client'

import React from 'react'
import ChromeWrapper from '@/app/ChromeWrapper'
import { Providers } from '@/components/Providers'
import { DrawerProvider, useDrawerContext } from '@/components/drawer/DrawerProvider'
import DrawerOverlay from '@/components/drawer/DrawerOverlay'
import { TableContextProvider } from '@/components/TableContext'
import { MinimizedDrawersBar } from '@/components/drawer/MinimizedDrawersBar'

function DrawerLayout({ children }: { children: React.ReactNode }) {
  const { groupedMinimizedDrawers, restoreDrawer, closeDrawer } = useDrawerContext()


  return (
    <>
      {children}
      <DrawerOverlay />
      <MinimizedDrawersBar
        groupedDrawers={groupedMinimizedDrawers}
        onRestoreIndividual={restoreDrawer}
        onCloseIndividual={closeDrawer}
      />
    </>
  )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChromeWrapper defaultOpen={false}>
      <Providers>
        <TableContextProvider>
          <DrawerProvider>
            <DrawerLayout>{children}</DrawerLayout>
          </DrawerProvider>
        </TableContextProvider>
      </Providers>
    </ChromeWrapper>
  )
}
