import { getHotels } from '@/api/hotels'
import type { HotelCatalogParams } from '@/types/hotel'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const HOTELS_QUERY_KEY = 'hotels'

export const useHotels = (params: HotelCatalogParams) =>
  useQuery({
    queryKey: [HOTELS_QUERY_KEY, params],
    queryFn: () => getHotels(params),
    placeholderData: keepPreviousData,
    staleTime: 60000,
  })
