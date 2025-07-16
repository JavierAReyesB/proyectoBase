// app/layout.tsx
import React from 'react'
import { cookies } from 'next/headers'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Header } from '@/components/Header/header'
import { DrawerProvider } from '@/components/drawer/DrawerProvider'
import DrawerOverlay from '@/components/drawer/DrawerOverlay'
import './globals.css'

export default async function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true'

  return (
    <html
      lang="es"
      className="bg-background"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <head>
        {/* Este style inline se inyecta antes de cualquier CSS: */}
        <style>{`
          html, body {
            background-color: var(--background);
          }
        `}</style>
      </head>
      <body className="h-full min-h-screen">
        {/* Header fijo */}
        <Header activeSection="dashboard" />

        {/* Contenedor principal con sidebar y contenido */}
        <div className="flex min-h-screen pt-14">
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <SidebarInset className="flex-1 flex flex-col">
              {/* DrawerProvider envuelve toda la app */}
              <DrawerProvider>
                {children}
                <DrawerOverlay /> {/* visible en todas las páginas */}
              </DrawerProvider>
            </SidebarInset>
          </SidebarProvider>
        </div>

        {/* Portal para los drawers */}
        <div id="drawer-root" />
      </body>
    </html>
  )
}

export const metadata = {
  generator: 'v0.dev'
}
