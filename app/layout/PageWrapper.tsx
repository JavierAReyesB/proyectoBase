/* PageWrapper.tsx */
'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import SidebarPanel from './SidebarPanel'
import SidebarToggleBar from './SidebarToggleBar'
import ChatPanel from './ChatPanel'
import Enhanced3DBackground from '@/styles/enhanced3dbackground' // <— asegúrate de que la
//                              ruta+mayúsculas coincide con el nombre real del fichero

type PanelKey = 'chat'

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

  const panels: Record<PanelKey, React.ReactNode> = {
    chat: <ChatPanel />
  }

  return (
    <div className='relative flex flex-1 h-[100dvh] md:h-screen overflow-hidden'>
      {/* Fondo 3D detrás de todo */}
      <Enhanced3DBackground />

      {/* CONTENIDO PRINCIPAL */}
      <main
        className={cn(
          'flex-1 overflow-y-auto max-h-[90dvh] md:max-h-screen pb-20 md:pb-0 transition-all duration-300 z-10',
          className
        )}
      >
        <div className='flex flex-col px-4 md:px-6 pt-[1rem] space-y-6'>
          {(title || description) && (
            <div>
              {title && <h1 className='text-2xl font-bold'>{title}</h1>}
              {description && (
                <p className='text-sm text-muted-foreground'>{description}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </main>

      {/* SIDEBAR + BARRA envueltos con z-20 */}
      <div className='relative z-20 flex'>
        <SidebarPanel
          active={activePanel}
          panels={panels}
          onClose={() => setActivePanel(null)}
        />

        <SidebarToggleBar active={activePanel} onToggle={setActivePanel} />
      </div>
    </div>
  )
}

export default PageWrapper
