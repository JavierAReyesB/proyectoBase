'use client'

import { PageWrapper } from '@/app/(client)/layout/PageWrapper'
import { JobTablePanel } from './JobTablePanel'

export default function ListadoTrabajosPage() {
  return (
    <PageWrapper>
      <JobTablePanel />
    </PageWrapper>
  )
}
