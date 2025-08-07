'use client'

import React from 'react'
import { PageWrapper } from '@/app/(client)/layout/PageWrapper'
import { DeficienciaTablePanel } from './tablePanel'
import { FiltrosDeficienciasProvider } from './FiltrosDeficienciasContext'
import { FiltersPanelProvider } from '@/app/(client)/layout/FiltersPanelContext'
import { DeficienciasTableFiltersWrapper } from './DeficienciasTableFiltersWrapper'

export default function ListadoDeficienciasPage() {
  return (
    <FiltrosDeficienciasProvider>
      <FiltersPanelProvider filtersComponent={<DeficienciasTableFiltersWrapper />}>
        <PageWrapper>
          <DeficienciaTablePanel />
        </PageWrapper>
      </FiltersPanelProvider>
    </FiltrosDeficienciasProvider>
  )
}
