import { apiClient } from '@/configs/axios'
import type { Hotel, HotelListResponse, HotelSearchParams } from '@/types/hotel'

export const searchHotels = async (params: HotelSearchParams): Promise<HotelListResponse> => {
  const { data } = await apiClient.get<HotelListResponse>('/hotels', { params })
  return data
}

export const getHotelById = async (id: string): Promise<Hotel> => {
  const { data } = await apiClient.get<Hotel>(`/hotels/${id}`)
  return data
}
