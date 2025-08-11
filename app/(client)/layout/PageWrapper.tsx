'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  MessageCircle,
  Settings,
  HelpCircle,
  Filter,
  Zap,
  LayoutGrid, 
} from 'lucide-react'

import SidebarPanel from './SidebarPanel'
import SidebarToggleBar from './SidebarToggleBar'
import ChatPanel from './ChatPanel'
import SettingsPanel from './SettingsPanel' 
import HelpPanel from './HelpPanel'         
import FiltersPanel from './FiltersPanel'
import ActionsPanel from './ActionsPanel'
import { useFiltersPanel } from '@/app/(client)/layout/FiltersPanelContext'

import Enhanced3DBackground from '@/styles/enhanced3dbackground'

type PanelKey = 'chat' | 'settings' | 'help' | 'filters' | 'actions'

interface PageWrapperProps {
  className?: string
  children: React.ReactNode
  title?: string
  description?: string
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  className,
  children,
  title,
  description
}) => {
  const [activePanel, setActivePanel] = useState<PanelKey | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: ''
  })
  const dynamicFilterPanel = useFiltersPanel()

  const panels: Record<PanelKey, React.ReactNode> = {
    chat: <ChatPanel />,
    settings: <SettingsPanel />,
    help: <HelpPanel />,
    filters: dynamicFilterPanel || <FiltersPanel current={filters} onChange={setFilters} />,
    actions: <ActionsPanel />
  }

  const titles: Record<PanelKey, string> = {
    chat: 'Chat',
    settings: 'Configuración',
    help: 'Centro de ayuda',
    filters: 'Filtros',
    actions: 'Acciones rápidas'
  }

  const buttons: { key: PanelKey; icon: React.ReactNode; label: string }[] = [
    { key: 'chat', icon: <MessageCircle className="w-5 h-5" />, label: 'Chat' },
    { key: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Configuración' },
    { key: 'help', icon: <HelpCircle className="w-5 h-5" />, label: 'Ayuda' },
    { key: 'filters', icon: <Filter className="w-5 h-5" />, label: 'Filtros' },
    { key: 'actions', icon: <Zap className="w-5 h-5" />, label: 'Acciones' }
  ]

  return (
    <div className="relative flex flex-1 h-[100dvh] md:h-screen overflow-hidden">
      {/* Fondo 3D detrás de todo */}
      <Enhanced3DBackground />

      {/* CONTENIDO PRINCIPAL */}
      <main
        style={{
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none' 
        }}
        className={cn(
          'flex-1 overflow-y-auto max-h-[90dvh] md:max-h-screen pb-32 md:pb-0 transition-all duration-300 z-10',
          className
        )}
      >
        <div className="flex flex-col px-4 md:px-6 pt-[1rem] space-y-6">
          {(title || description) && (
            <div>
              {title && <h1 className="text-2xl font-bold">{title}</h1>}
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          )}
          {children}
          <div className="h-16" />
        </div>
      </main>

      {/* SIDEBAR + BARRA */}
      <div className="relative z-20 flex">
        <SidebarPanel
          active={activePanel}
          onClose={() => setActivePanel(null)}
          panels={panels}
          titles={titles}
        />

        {/* 👇 Aquí cambiamos el icono del FAB pasando `fabIcon` */}
        <SidebarToggleBar
          active={activePanel}
          onToggle={setActivePanel}
          buttons={buttons}
          fabIcon={<LayoutGrid size={26} strokeWidth={2.25} />} 
        />
      </div>
    </div>
  )
}

export default PageWrapper
