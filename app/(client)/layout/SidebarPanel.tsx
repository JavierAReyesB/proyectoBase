'use client'

import React, { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

interface SidebarPanelProps {
  active: string | null
  onClose: () => void
  panels: Record<string, React.ReactNode>
  titles?: Record<string, string> 
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({
  active,
  panels,
  onClose,
  titles = {} 
}) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const CurrentPanel = active ? panels[active] : null
  const currentTitle = active ? titles[active] || active : ''

  // 📱 Móvil → Modal de pantalla completa
  if (isMobile) {
    return (
      <Modal
        open={!!active}
        title={currentTitle}
        onOpenChange={(open) => {
          if (!open) onClose()
        }}
        size="full"
      >
        <VisuallyHidden>
          <h2>{currentTitle}</h2>
        </VisuallyHidden>

        <div className="flex flex-col h-[80vh]">
          <div className="flex-1 overflow-y-auto">
            {CurrentPanel}
          </div>
        </div>
      </Modal>
    )
  }

  // 🖥️ Escritorio → Sidebar deslizante
  return (
    <aside
      className={`z-30 transition-all duration-300 bg-white border-l shadow-lg
                 h-full overflow-x-hidden ${active ? 'w-96' : 'w-0'}`}
    >
      {active && (
        <div className="flex flex-col h-full relative">
          <div className="flex-1 min-h-0">
            {CurrentPanel}
          </div>
        </div>
      )}
    </aside>
  )
}

export default SidebarPanel
