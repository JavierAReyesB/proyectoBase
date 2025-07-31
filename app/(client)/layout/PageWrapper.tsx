'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import SidebarPanel from './SidebarPanel'
import SidebarToggleBar from './SidebarToggleBar'
import ChatPanel from './ChatPanel'
import SettingsPanel from './SettingsPanel' 
import HelpPanel from './HelpPanel'         
import FiltersPanel from './FiltersPanel'
import ActionsPanel from './ActionsPanel'


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


  const panels: Record<PanelKey, React.ReactNode> = {
  chat: <ChatPanel />,
  settings: <SettingsPanel />,
  help: <HelpPanel />,
  filters: <FiltersPanel current={filters} onChange={setFilters} />,
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
  { key: 'chat', icon: '💬', label: 'Chat' },
  { key: 'settings', icon: '⚙️', label: 'Configuración' },
  { key: 'help', icon: '❓', label: 'Ayuda' },
  { key: 'filters', icon: '🧮', label: 'Filtros' },
  { key: 'actions', icon: '⚡', label: 'Acciones' } 
]




  return (
    <div className="relative flex flex-1 h-[100dvh] md:h-screen overflow-hidden">
      {/* Fondo 3D detrás de todo */}
      <Enhanced3DBackground />

      {/* CONTENIDO PRINCIPAL */}
      <main
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
        <SidebarToggleBar
          active={activePanel}
          onToggle={setActivePanel}
          buttons={buttons}
        />
      </div>
    </div>
  )
}

export default PageWrapper
