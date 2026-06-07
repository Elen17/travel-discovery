import type { SidebarFiltersState } from '../../types'

export type CountryOption = {
  id: string
  name: string
}

export type FiltersSidebarProps = SidebarFiltersState & {
  countryOptions: CountryOption[]
  onApply: (filters: SidebarFiltersState) => void
}
