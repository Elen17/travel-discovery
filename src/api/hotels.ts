import { apiClient } from '@/configs/axios'
import type {
  CreateHotelReviewPayload,
  HotelDetail,
  HotelListResponse,
  HotelReview,
  HotelReviewsPage,
  HotelSearchParams,
} from '@/types/hotel'

export const searchHotels = async (params: HotelSearchParams): Promise<HotelListResponse> => {
  const { data } = await apiClient.get<HotelListResponse>('/hotels', { params })
  return data
}

export const getHotelById = async (id: string): Promise<HotelDetail> => {
  const { data } = await apiClient.get<HotelDetail>(`/hotels/${id}`)
  return data
}

export const getHotelReviews = async (
  id: string,
  page = 0,
  size = 10,
): Promise<HotelReviewsPage> => {
  const { data } = await apiClient.get<HotelReviewsPage>(`/hotels/${id}/reviews`, {
    params: { page, size },
  })
  return data
}

export const createHotelReview = async (
  id: string,
  payload: CreateHotelReviewPayload,
): Promise<HotelReview> => {
  const { data } = await apiClient.post<HotelReview>(`/hotels/${id}/reviews`, payload)
  return data
}
