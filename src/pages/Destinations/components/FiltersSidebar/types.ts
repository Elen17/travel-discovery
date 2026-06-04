import type { SidebarFiltersState } from '../../types'

export type CountryOption = {
  id: string
  name: string
}

export type FiltersSidebarProps = SidebarFiltersState & {
  countryOptions: CountryOption[]
  cityOptions: string[]
  citiesLoading: boolean
  onApply: (filters: SidebarFiltersState) => void
}
