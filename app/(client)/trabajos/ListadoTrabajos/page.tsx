'use client'

import React from 'react'
import { PageWrapper } from '@/app/(client)/layout/PageWrapper'
import { JobTablePanel } from './JobTablePanel'
import { FiltersPanelProvider } from '@/app/(client)/layout/FiltersPanelContext'
import { JobTableFiltersWrapper } from './JobTableFiltersWrapper'

import { FiltrosJobsProvider } from './FiltrosJobsContext'

export default function ListadoTrabajosPage() {
  return (
    <FiltrosJobsProvider> 
      <FiltersPanelProvider filtersComponent={<JobTableFiltersWrapper />}>
        <PageWrapper>
          <JobTablePanel />
        </PageWrapper>
      </FiltersPanelProvider>
    </FiltrosJobsProvider>
  )
}
