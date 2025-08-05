'use client'

import { PageWrapper } from '@/app/(client)/layout/PageWrapper'
import { TablePanel } from './tablePanel'
import { FiltersPanelProvider } from '@/app/(client)/layout/FiltersPanelContext'
import { PuntosTableFiltersWrapper } from './tableFiltersWrapper'
import { FiltersProvider } from '../../layout/FiltersContext'

export default function ListadoPuntosPage() {
  return (
    <FiltersProvider>                             
      <FiltersPanelProvider filtersComponent={<PuntosTableFiltersWrapper />}>
        <PageWrapper>
          <TablePanel />
        </PageWrapper>
      </FiltersPanelProvider>
    </FiltersProvider>
  )
}
