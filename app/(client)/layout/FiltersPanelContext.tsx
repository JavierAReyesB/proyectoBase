
import React, { createContext, useContext, ReactNode } from 'react'

type FiltersComponent = ReactNode

const FiltersPanelContext = createContext<FiltersComponent>(null)

export const useFiltersPanel = () => useContext(FiltersPanelContext)

export const FiltersPanelProvider = ({
  children,
  filtersComponent,
}: {
  children: ReactNode
  filtersComponent: FiltersComponent
}) => {
  return (
    <FiltersPanelContext.Provider value={filtersComponent}>
      {children}
    </FiltersPanelContext.Provider>
  )
}
