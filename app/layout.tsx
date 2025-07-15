/* app/layout.tsx */
import type React from 'react'
import { cookies } from 'next/headers'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Header } from '@/components/Header/header'
import { DrawerProvider } from '@/components/drawer/DrawerProvider'
import DrawerOverlay from '@/components/drawer/DrawerOverlay'
import Enhanced3DBackground from '@/styles/enhanced3dbackground'   // fondo + logo
import './globals.css'

/* ----------  LAYOUT (Server Component)  ---------- */
export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true'

  return (
    <html lang="es">
      {/* ⬇ fondo transparente por defecto */}
      <body className="relative h-full min-h-screen bg-transparent">
        {/* Fondo 3D: se monta una sola vez, detrás de todo */}
        <Enhanced3DBackground />

        {/* Header fijo */}
        <Header />

        {/* Contenedor principal con sidebar y contenido */}
        <div className="flex min-h-screen pt-14">
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <SidebarInset className="flex-1 flex flex-col bg-transparent">
              <DrawerProvider>
                {children}
                <DrawerOverlay />
              </DrawerProvider>
            </SidebarInset>
          </SidebarProvider>
        </div>

        {/* Portal de drawers */}
        <div id="drawer-root" />
      </body>
    </html>
  )
}

/* Opcional: metadatos (permitidos en Server Components) */
export const metadata = {
  generator: 'v0.dev'
}
