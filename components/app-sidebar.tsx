'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Home,
  Users,
  Package,
  Settings,
  LayoutDashboard,
  BarChart2
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar
} from '@/components/ui/sidebar'
import { SidebarToggleButton } from './sidebar-toggle-button'

const mainNavigation = [
  { title: 'Inicio', icon: Home, url: '/inicio' },
  { title: 'Usuarios', icon: Users, url: '/usuarios' },
  { title: 'Contratos', icon: Package, url: '/contratos' },
  { title: 'Dashboard', icon: LayoutDashboard, url: '/dashboard' },
  { title: 'Trial Page', icon: BarChart2, url: '/trialpage' }
]

function SidebarContentInner({ isMobileView = false }: { isMobileView?: boolean }) {
  let state = 'expanded'
  let isMobile = isMobileView

  try {
    const sidebar = useSidebar()
    state = sidebar?.state ?? 'expanded'
    isMobile = isMobileView || sidebar?.isMobile
  } catch {
    // No SidebarProvider
  }

  return (
    <>
      <SidebarContent className="bg-[#1E293B] text-white h-full">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        'flex items-center justify-start gap-2',
                        'transition-[width,padding] duration-200 ease-linear',
                        state === 'collapsed' && !isMobile
                          ? 'w-[--sidebar-width-icon] px-2 overflow-hidden'
                          : 'w-full px-2',
                        state === 'collapsed' &&
                          !isMobile &&
                          'group-hover:w-full group-hover:px-2'
                      )}
                    >
                      <item.icon className="size-4 shrink-0 text-white" />
                      <span
                        className={cn(
                          'whitespace-nowrap text-white',
                          'transition-[max-width,opacity] duration-200 ease-linear',
                          state === 'collapsed' && !isMobile
                            ? 'max-w-0 opacity-0'
                            : 'max-w-[200px] opacity-100',
                          state === 'collapsed' &&
                            !isMobile &&
                            'group-hover:max-w-[200px] group-hover:opacity-100'
                        )}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-[#1E293B]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="#"
                className={cn(
                  'flex items-center justify-start gap-2',
                  'transition-[width,padding] duration-200 ease-linear',
                  state === 'collapsed' && !isMobile
                    ? 'w-[--sidebar-width-icon] px-2 overflow-hidden'
                    : 'w-full px-2',
                  state === 'collapsed' &&
                    !isMobile &&
                    'group-hover:w-full group-hover:px-2'
                )}
              >
                <Settings className="size-4 shrink-0 text-white" />
                <span
                  className={cn(
                    'whitespace-nowrap text-white',
                    'transition-[max-width,opacity] duration-200 ease-linear',
                    state === 'collapsed' && !isMobile
                      ? 'max-w-0 opacity-0'
                      : 'max-w-[200px] opacity-100',
                    state === 'collapsed' &&
                      !isMobile &&
                      'group-hover:max-w-[200px] group-hover:opacity-100'
                  )}
                >
                  Avanzadi
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}

/** ✅ Sidebar de escritorio con media query, sin condicionales ni parpadeo */
export function AppSidebar() {
  return (
    <div className="hidden lg:flex">
      <Sidebar collapsible="icon" className="bg-[#1E293B] text-white">
        <SidebarContentInner />
        <SidebarToggleButton />
      </Sidebar>
    </div>
  )
}

/** 📱 Drawer móvil */
export function AppSidebarContentMobile() {
  return <SidebarContentInner isMobileView />
}
