'use client'

import { MinimizedDrawersBar } from './MinimizedDrawersBar'
import { useDrawerContext } from './DrawerProvider'

export default function DrawerOverlay() {
  // 👈 asegúrate de usar "export default"
  const { groupedMinimizedDrawers, restoreDrawer, closeDrawer } =
    useDrawerContext()

  return (
    <MinimizedDrawersBar
      groupedDrawers={groupedMinimizedDrawers}
      onRestoreIndividual={restoreDrawer}
      onCloseIndividual={closeDrawer}
    />
  )
}
