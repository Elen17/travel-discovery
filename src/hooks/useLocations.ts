import { getCountries, getCitiesByCountry } from '@/api/locations'
import { useQuery } from '@tanstack/react-query'

export const COUNTRIES_QUERY_KEY = 'countries'
export const CITIES_QUERY_KEY = 'cities'

export const useCountries = () =>
  useQuery({
    queryKey: [COUNTRIES_QUERY_KEY],
    queryFn: getCountries,
    staleTime: 1000 * 60 * 30,
  })

export const useCitiesByCountry = (countryId: string | null) =>
  useQuery({
    queryKey: [CITIES_QUERY_KEY, countryId],
    queryFn: () => getCitiesByCountry(countryId!),
    enabled: !!countryId,
    staleTime: 1000 * 60 * 60,
  })
