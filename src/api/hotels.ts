import { apiClient } from '@/configs/axios'
import type { PageResponse } from '@/types/api'
import type { Hotel, HotelCatalogParams, HotelLiveSearchParams } from '@/types/hotel'

/** Live search — triggers ingestion then returns DB-backed hotels (plain array). */
export const searchHotelsLive = async (params: HotelLiveSearchParams): Promise<Hotel[]> => {
  const { data } = await apiClient.get<Hotel[]>('/hotels/search', { params })
  return data
}

/** Paginated catalog listing with optional star-rating filter. */
export const getHotels = async (params: HotelCatalogParams): Promise<PageResponse<Hotel>> => {
  const { data } = await apiClient.get<PageResponse<Hotel>>('/hotels', { params })
  return data
}

export const getHotelById = async (id: number): Promise<Hotel> => {
  const { data } = await apiClient.get<Hotel>(`/hotels/${id}`)
  return data
}
