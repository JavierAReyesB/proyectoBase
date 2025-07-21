'use client'

import React from 'react'
import { useDrawerContext } from './DrawerProvider'
import { GenericDrawer } from './GenericDrawer'
import { MinimizedDrawersBar } from './MinimizedDrawersBar'
import type { DrawerState } from './drawerTypes'

export default function DrawerOverlay() {
  const {
    openDrawers,
    minimizeDrawer,
    closeDrawer,
    restoreDrawer,
    resizeDrawer,
    pinDrawer,
    groupedMinimizedDrawers
  } = useDrawerContext()

  return (
    <>
      {/* Render each open drawer */}
      {openDrawers.map((d: DrawerState, idx: number) => (
        <GenericDrawer
          key={d.id}
          title={d.title}
          visible={true}
          isSecondDrawer={idx > 0}
          width={d.width}
          instanceId={d.instanceId}
          icon={d.icon}
          contentKey={d.contentKey}
          contentData={d.contentData}
          onMinimize={() => minimizeDrawer(d)}
          onClose={() => closeDrawer(d.id)}
          toggleSize={() =>
            resizeDrawer(d.id, d.width === 'full' ? 'half' : 'full')
          }
          onPin={(pinned: boolean) => pinDrawer(d.id, pinned)}
        >
          {d.content}
        </GenericDrawer>
      ))}

      {/* Floating minimized bar */}
      <MinimizedDrawersBar
        groupedDrawers={groupedMinimizedDrawers}
        onRestoreIndividual={restoreDrawer}
        onCloseIndividual={closeDrawer}
      />
    </>
  )
}
