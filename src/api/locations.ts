import { apiClient } from '@/configs/axios'
import type { City, Country } from '@/types/location'

export const getCountries = async (): Promise<Country[]> => {
  const { data } = await apiClient.get<Country[]>('/locations/countries')
  return data
}

export const getCountriesWithCities = async (): Promise<Country[]> => {
  const { data } = await apiClient.get<Country[]>('/locations/countries/cities')
  return data
}

export const getCitiesByCountry = async (countryId: string): Promise<City[]> => {
  const { data } = await apiClient.get<City[]>(`/locations/countries/${countryId}/cities`)
  return data
}
