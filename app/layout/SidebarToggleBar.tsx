// SidebarToggleBar.tsx
'use client'

import React from 'react'

interface Props {
  active: string | null
  onToggle: (panel: 'chat' | null) => void
}

const SidebarToggleBar: React.FC<Props> = ({ active, onToggle }) => {
  const toggle = () => onToggle(active === 'chat' ? null : 'chat')

  return (
    <div
      className='
        z-30 w-14 bg-[#1d2b44] text-white   /* ← color personalizado */
        flex flex-col items-center py-4
        flex-shrink-0 h-full
      '
    >
      <button onClick={toggle} title='Chat' className='text-xl'>
        💬
      </button>
    </div>
  )
}

export default SidebarToggleBar
