'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  {
    title: 'Trabajos',
    icon: Users,
    children: [
      { title: 'Trabajos', url: '/trabajos/ListadoTrabajos' },
      { title: 'Deficiencias', url: '/trabajos/ListadoDeficienciasCliente' },
      { title: 'Avisos', url: '/trabajos/ListadoAvisos' },
      { title: 'Inventario Puntos de Control', url: '/trabajos/ListadoPuntos' },
      { title: 'Plan de Trabajo', url: '/trabajos/ListadoPlanTrabajo' }
    ]
  },
  {
    title: 'Documentación',
    icon: Package, 
    children: [
      { title: 'Productos', url: '/documentacion/ListadoProductos' }
    ]
  },

  // {
  //   title: 'Contratos',
  //   icon: Package,
  //   children: [
  //     { title: 'Listado', url: '/contratos' },
  //     { title: 'Nuevo Contrato', url: '/contratos/nuevo' }
  //   ]
  // },
  { title: 'Dashboard', icon: LayoutDashboard, url: '/dashboard' },
  
]

function SidebarContentInner({ isMobileView = false }: { isMobileView?: boolean }) {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  let state = 'expanded'
  let isMobile = isMobileView

  try {
    const sidebar = useSidebar()
    state = sidebar?.state ?? 'expanded'
    isMobile = isMobileView || sidebar?.isMobile
  } catch {
    
  }

  /* Abre / cierra sub-menús al cambiar de ruta -------------------------- */
useEffect(() => {

  if (state === 'collapsed' && !isMobile) {
    setOpenMenus({})
    return
  }

  const newOpen: Record<string, boolean> = {}
  mainNavigation.forEach(item => {
    if (item.children?.some(child => pathname?.startsWith(child.url))) {
      newOpen[item.title] = true
    }
  })
  setOpenMenus(prev => ({ ...prev, ...newOpen }))
}, [pathname, state, isMobile])


  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        if (width <= 80) {
          setOpenMenus({})
        }
      }
    })

    if (sidebarRef.current) {
      observer.observe(sidebarRef.current)
    }

    return () => {
      if (sidebarRef.current) {
        observer.unobserve(sidebarRef.current)
      }
    }
  }, [])

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <>
      <SidebarContent ref={sidebarRef} className="bg-[#1E293B] text-white h-full">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavigation.map((item) =>
                item.children ? (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => toggleMenu(item.title)}
                      className={cn(
                        'flex items-center justify-start gap-2 cursor-pointer',
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
                    </SidebarMenuButton>

                    {openMenus[item.title] && (
                      <ul className="ml-6 pl-2 border-l border-white/20">
                        {item.children.map((sub) => (
                          <li key={sub.title} className="py-1">
                            <Link
                              href={sub.url}
                              className="block text-sm text-white hover:underline"
                            >
                              {sub.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </SidebarMenuItem>
                ) : (
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
                )
              )}
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

export function AppSidebarContentMobile() {
  return <SidebarContentInner isMobileView />
}
