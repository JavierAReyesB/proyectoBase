'use client'

import ContratosPanel from '@/app/(client)/contratos/ContratosPanel'

export default function ContratosWidget() {
  /* El widget solo adapta el panel al espacio disponible */
  return (
    <div className="flex flex-col h-full">
      <ContratosPanel />
    </div>
  )
}
