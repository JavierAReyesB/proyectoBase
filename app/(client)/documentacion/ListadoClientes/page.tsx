'use client'

import React from 'react'
import { PageWrapper } from '@/app/(client)/layout/PageWrapper'
import { FiltersPanelProvider } from '@/app/(client)/layout/FiltersPanelContext'
import { TablePanel } from './TablePanel'
import AvisosTableFiltersWrapper from './AvisosTableFiltersWrapper'
import { FiltrosAvisosProvider } from './FiltrosAvisosContext'

export default function ListadoAvisosPage() {
  return (
    <FiltrosAvisosProvider>
      <FiltersPanelProvider filtersComponent={<AvisosTableFiltersWrapper />}>
        <PageWrapper>
          <TablePanel />
        </PageWrapper>
      </FiltersPanelProvider>
    </FiltrosAvisosProvider>
  )
}
