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
    const compute = () => {
      // tu criterio principal
      const byWidth = window.innerWidth < 900
      // fallback para emuladores/extensiones
      const byMQ = typeof window.matchMedia === 'function'
        ? window.matchMedia('(max-width: 900px)').matches
        : false
      setIsMobile(byWidth || byMQ)
    }

    compute()
    window.addEventListener('resize', compute)
    window.addEventListener('orientationchange', compute)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', compute)
      window.visualViewport.addEventListener('scroll', compute)
    }
    return () => {
      window.removeEventListener('resize', compute)
      window.removeEventListener('orientationchange', compute)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', compute)
        window.visualViewport.removeEventListener('scroll', compute)
      }
    }
  }, [])

  // fuerza recálculo al abrir (algunas extensiones no invalidan layout)
  useEffect(() => {
    if (!active) return
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
  }, [active])

  const CurrentPanel = active ? panels[active] : null
  const currentTitle = active ? titles[active] || active : ''

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

        {/* Deja que el Modal gestione el scroll interno */}
        {CurrentPanel}
      </Modal>
    )
  }

  return (
    <aside
      className={`z-30 transition-all duration-300 bg-white border-l shadow-lg
              h-screen overflow-hidden ${active ? 'w-[420px]' : 'w-0'}`}
    >
      {active && (
        <div className="flex flex-col h-full relative">
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-none">
            <div className="pr-4">{CurrentPanel}</div>
          </div>
        </div>
      )}
    </aside>
  )
}

export default SidebarPanel
