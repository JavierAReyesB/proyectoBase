'use client'

import { PageWrapper } from '@/app/(client)/layout/PageWrapper'
import { DeficienciaTablePanel } from './tablePanel'

export default function ListadoDeficienciasPage() {
  return (
    <PageWrapper>
      <DeficienciaTablePanel />
    </PageWrapper>
  )
}
