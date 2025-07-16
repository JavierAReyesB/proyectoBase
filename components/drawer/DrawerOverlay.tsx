'use client'

import React from 'react'
import { useDrawerContext } from './DrawerProvider'
import { GenericDrawer } from './GenericDrawer'
import { MinimizedDrawersBar } from './MinimizedDrawersBar'

export default function DrawerOverlay() {
  const {
    hydrated,
    openDrawers,
    minimizeDrawer,
    closeDrawer,
    restoreDrawer,
    resizeDrawer,
    pinDrawer,
    groupedMinimizedDrawers
  } = useDrawerContext()

  // NO renderizamos nada hasta que el hook haya hidratado
  if (!hydrated) return null

  return (
    <>
      {openDrawers.map((d, idx) => (
        <GenericDrawer
          key={d.id}
          title={d.title}
          visible={true}
          isSecondDrawer={idx > 0}
          width={d.width}
          instanceId={d.instanceId}
          icon={d.icon}
          onMinimize={() => minimizeDrawer(d)}
          onClose={() => closeDrawer(d.id)}
          toggleSize={() =>
            resizeDrawer(d.id, d.width === 'full' ? 'half' : 'full')
          }
          onPin={(pinned) => pinDrawer(d.id, pinned)}
        >
          {d.content}
        </GenericDrawer>
      ))}

      <MinimizedDrawersBar
        groupedDrawers={groupedMinimizedDrawers}
        onRestoreIndividual={restoreDrawer}
        onCloseIndividual={closeDrawer}
      />
    </>
  )
}
