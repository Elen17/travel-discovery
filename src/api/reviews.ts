import { apiClient } from '@/configs/axios'
import type { PageResponse } from '@/types/api'
import type { HotelReviewsParams, Review, ReviewPayload } from '@/types/review'

export const getHotelReviews = async (
  hotelId: number,
  params?: HotelReviewsParams,
): Promise<PageResponse<Review>> => {
  const { data } = await apiClient.get<PageResponse<Review>>(`/hotels/${hotelId}/reviews`, {
    params,
  })
  return data
}

export const upsertHotelReview = async (
  hotelId: number,
  payload: ReviewPayload,
): Promise<Review> => {
  const { data } = await apiClient.post<Review>(`/hotels/${hotelId}/reviews`, payload)
  return data
}

export const deleteHotelReview = async (hotelId: number, reviewId: number): Promise<void> => {
  await apiClient.delete(`/hotels/${hotelId}/reviews/${reviewId}`)
}
