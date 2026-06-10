import { apiClient } from '@/configs/axios'
import { getHotelById } from '@/api/hotels'
import type { Favourite } from '@/types/favourite'
import type { Hotel } from '@/types/hotel'

export const FAVOURITES_QUERY_KEY = ['favourites'] as const
export const FAVOURITE_HOTELS_QUERY_KEY = ['favourites', 'hotels'] as const

const normalizeFavourites = (data: unknown): Favourite[] => {
  if (!Array.isArray(data)) {
    return []
  }

  return data.flatMap((item): Favourite[] => {
    if (typeof item === 'number') {
      return [{ hotelId: item }]
    }

    if (typeof item !== 'object' || item === null) {
      return []
    }

    if ('hotelId' in item && typeof item.hotelId === 'number') {
      return [
        {
          hotelId: item.hotelId,
          id: 'id' in item && typeof item.id === 'number' ? item.id : undefined,
        },
      ]
    }

    if ('id' in item && typeof item.id === 'number') {
      return [{ hotelId: item.id }]
    }

    return []
  })
}

export const getFavourites = async (): Promise<Favourite[]> => {
  const { data } = await apiClient.get<unknown>('/favourites')
  return normalizeFavourites(data)
}

export const fetchFavouriteHotels = async (): Promise<Hotel[]> => {
  const favourites = await getFavourites()

  if (favourites.length === 0) {
    return []
  }

  const results = await Promise.allSettled(
    favourites.map((favourite) => getHotelById(`${favourite.hotelId}`)),
  )

  return results
    .filter((result): result is PromiseFulfilledResult<Hotel> => result.status === 'fulfilled')
    .map((result) => result.value)
}

export const addFavourite = async (hotelId: number): Promise<void> => {
  await apiClient.post(`/favourites/${hotelId}`)
}

export const removeFavourite = async (hotelId: number): Promise<void> => {
  await apiClient.delete(`/favourites/${hotelId}`)
}
