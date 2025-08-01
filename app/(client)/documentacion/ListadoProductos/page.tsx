'use client'

import { PageWrapper } from '@/app/(client)/layout/PageWrapper'
import { ProductoTablePanel } from './tablePanel'

export default function ListadoProductosPage() {
  return (
    <PageWrapper>
      <ProductoTablePanel />
    </PageWrapper>
  )
}
