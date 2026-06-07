import type { CountryOption } from './types'

export const buildCountryOptions = (countryOptions: CountryOption[], allLabel: string) => [
  { value: '', label: allLabel },
  ...countryOptions.map((c) => ({ value: c.name, label: c.name })),
]

export const buildCityOptions = (cityOptions: string[], selectLabel: string) => [
  { value: '', label: selectLabel },
  ...cityOptions.map((c) => ({ value: c, label: c })),
]
