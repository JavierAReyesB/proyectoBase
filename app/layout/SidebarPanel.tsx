import React from 'react'

interface SidebarPanelProps {
  active: string | null
  onClose: () => void
  panels: Record<string, React.ReactNode>
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({
  active,
  panels,
  onClose
}) => {
  const CurrentPanel = active ? panels[active] : null

  return (
    <aside
      className={`z-30 transition-all duration-300 bg-white border-l shadow-lg
                   h-full overflow-x-hidden ${active ? 'w-96' : 'w-0'}`}
    >
      {active && (
        <div className='flex flex-col h-full relative'>
          {' '}
          {/* ← relative */}
          <div className='flex-1 min-h-0'>
            {CurrentPanel} {/* ChatPanel */}
          </div>
        </div>
      )}
    </aside>
  )
}

export default SidebarPanel
