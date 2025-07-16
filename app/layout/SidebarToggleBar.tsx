'use client'

import React, { useEffect, useState } from 'react'

interface Props {
  active: string | null
  onToggle: (panel: 'chat' | null) => void
}

const SidebarToggleBar: React.FC<Props> = ({ active, onToggle }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 840) // 🔁 alineado con Tailwind `md`
    }

    handleResize() // Evalúa al montar
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggle = () => onToggle(active === 'chat' ? null : 'chat')

  if (isMobile) {
    // 📱 Versión Móvil: botón flotante (FAB)
    return (
      <div
        className="fixed z-[9999]"
        style={{
          right: '1rem',
          bottom: 'calc(1rem + env(safe-area-inset-bottom))',
        }}
      >
        <button
          onClick={toggle}
          title="Chat"
          className="
            h-12 w-12 rounded-full shadow-lg bg-[#1d2b44] text-white
            flex items-center justify-center text-2xl
          "
        >
          💬
        </button>
      </div>
    )
  }

  // 🖥️ Versión Escritorio: barra lateral vertical
  return (
    <div
      className="
        z-30 w-14 bg-[#1d2b44] text-white
        flex flex-col items-center py-4
        flex-shrink-0 h-full
      "
    >
      <button onClick={toggle} title="Chat" className="text-xl">
        💬
      </button>
    </div>
  )
}

export default SidebarToggleBar
