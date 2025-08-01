'use client'

import React from 'react'

// 👇 Asegúrate de que este tipo coincida con el usado en PageWrapper
export type PanelKey = 'chat' | 'settings' | 'help' | 'filters' | 'actions'

interface ButtonConfig {
  key: PanelKey
  icon: React.ReactNode
  label?: string
}

interface Props {
  active: PanelKey | null
  onToggle: (panel: PanelKey | null) => void
  buttons?: ButtonConfig[]
}

const SidebarToggleBar: React.FC<Props> = ({ active, onToggle, buttons = [] }) => {
  const handleClick = (key: PanelKey) => {
    onToggle(active === key ? null : key)
  }

  return (
    <>
      {/* 📱 FAB para móviles (solo primer botón visible) */}
      {buttons.length > 0 && (
        <div
          className="fixed z-[9999] block lg:hidden"
          style={{
            right: '1rem',
            bottom: 'calc(3.5rem + env(safe-area-inset-bottom))',
          }}
        >
          <button
            onClick={() => handleClick(buttons[0].key)}
            title={buttons[0].label || buttons[0].key}
            className="h-12 w-12 rounded-full shadow-lg bg-[#1d2b44] text-white flex items-center justify-center text-2xl"
          >
            {buttons[0].icon}
          </button>
        </div>
      )}

      {/* 🖥️ Barra lateral en escritorio con múltiples botones */}
      <div className="hidden lg:flex z-30 w-12 bg-[#1d2b44] text-white flex-col items-center py-4 flex-shrink-0 h-full space-y-6">
        {buttons.map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => handleClick(key)}
            title={label || key}
            className={`text-xl transition-all ${
              active === key ? 'scale-125 text-yellow-300' : 'opacity-70 hover:opacity-100'
            }`}
          >
            {icon}
          </button>
        ))}
      </div>
    </>
  )
}

export default SidebarToggleBar
