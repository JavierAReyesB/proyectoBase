'use client'

import React from 'react'

interface Props {
  active: string | null
  onToggle: (panel: 'chat' | null) => void
}

const SidebarToggleBar: React.FC<Props> = ({ active, onToggle }) => {
  const toggle = () => onToggle(active === 'chat' ? null : 'chat')

  return (
    <>
      {/* 💬 FAB solo visible en móviles */}
      <div
        className="fixed z-[9999] block md:hidden"
        style={{
          right: '1rem',
          bottom: 'calc(3.5rem + env(safe-area-inset-bottom))',
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

      {/* 💬 Barra vertical solo visible en escritorio */}
      <div
        className="
          hidden md:flex
          z-30 w-14 bg-[#1d2b44] text-white
          flex-col items-center py-4
          flex-shrink-0 h-full
        "
      >
        <button onClick={toggle} title="Chat" className="text-xl">
          💬
        </button>
      </div>
    </>
  )
}

export default SidebarToggleBar
