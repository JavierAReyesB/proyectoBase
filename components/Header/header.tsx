'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { HeaderLogo } from './HeaderLogo'
import { HeaderSearch } from './HeaderSearch'
import { HeaderActions } from './HeaderActions'
import { AppSidebarContentMobile } from '../app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

interface HeaderProps {
  /** sección activa para resaltar en el menú */
  activeSection?: string
}
export function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 bg-dashboard-bg px-4 flex items-center">
      {/* ╭─────────────────── IZQUIERDA ───────────────────╮ */}
      {/* 🍔 Hamburguesa – visible en móvil/tablet (< lg) */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="flex lg:hidden p-2 text-white"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* 🗻 Logo
           • En móvil/tablet: centrado con absolute
           • En escritorio: vuelve al flujo normal a la izquierda */}
      <div
        className="
          absolute left-1/2 -translate-x-1/2
          lg:static lg:translate-x-0 lg:ml-4
        "
      >
        <HeaderLogo />
      </div>

      {/* ╭─────────────────── CENTRO / DERECHA ───────────────────╮ */}
      {/* 🔍 Buscador
           • Móvil/tablet: pegado a la derecha con ml-auto
           • Escritorio: centrado ocupando todo el espacio */}
      <div className="ml-auto lg:ml-0 lg:flex-1 lg:flex lg:justify-center">
        <HeaderSearch />
      </div>

      {/* ⚙️ Acciones – visibles solo en escritorio (≥ lg) */}
      <div className="hidden lg:flex ml-auto">
        <HeaderActions />
      </div>

      {/* ╭──────────────────── DRAWER MÓVIL ────────────────────╮ */}
      {sidebarOpen && (
        <SidebarProvider>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="absolute left-0 top-0 h-full w-64 bg-[#1E293B] text-white shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <AppSidebarContentMobile />
            </div>
          </div>
        </SidebarProvider>
      )}
    </header>
  )
}
