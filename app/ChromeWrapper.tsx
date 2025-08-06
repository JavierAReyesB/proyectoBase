'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Header } from '@/components/Header/header'
import { DrawerProvider } from '@/components/drawer/DrawerProvider'
import DrawerOverlay from '@/components/drawer/DrawerOverlay'
import MobileBottomBar from '@/components/Header/MobileBottomBar' 

interface ChromeWrapperProps {
  children: ReactNode
  defaultOpen: boolean
}

export default function ChromeWrapper({ children, defaultOpen }: ChromeWrapperProps) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register')

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen pt-14">
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <DrawerProvider>
              {children}
              <DrawerOverlay />
              <MobileBottomBar /> 
            </DrawerProvider>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  )
}
