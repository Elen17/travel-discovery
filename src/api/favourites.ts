import { apiClient } from '@/configs/axios'
import type { Hotel } from '@/types/hotel'

export const getFavourites = async (): Promise<Hotel[]> => {
  const { data } = await apiClient.get<Hotel[]>('/favourites')
  return data
}

export const addFavourite = async (hotelId: number): Promise<void> => {
  await apiClient.post(`/favourites/${hotelId}`)
}

export const removeFavourite = async (hotelId: number): Promise<void> => {
  await apiClient.delete(`/favourites/${hotelId}`)
}
