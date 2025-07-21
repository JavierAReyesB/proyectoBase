'use client'

import { PageWrapper } from '@/app/(client)/layout/PageWrapper'
import ContratosPanel from './ContratosPanel'

export default function ContratosPage() {
  return (
    <PageWrapper
      title="Contratos"
      description="Gestión de contratos registrados en el sistema."
    >
      <ContratosPanel />
    </PageWrapper>
  )
}
