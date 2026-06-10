import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createHotelReview, getHotelById, getHotelReviews } from '@/api/hotels'
import type { CreateHotelReviewPayload } from '@/types/hotel'

export const hotelQueryKeys = {
  detail: (id: string) => ['hotel', id] as const,
  reviews: (id: string, page: number, size: number) =>
    ['hotel-reviews', id, page, size] as const,
}

export const useHotel = (id: string | undefined) =>
  useQuery({
    queryKey: hotelQueryKeys.detail(id ?? ''),
    queryFn: () => getHotelById(id ?? ''),
    enabled: Boolean(id),
  })

export const useHotelReviews = (
  id: string | undefined,
  page = 0,
  size = 10,
  enabled = true,
) =>
  useQuery({
    queryKey: hotelQueryKeys.reviews(id ?? '', page, size),
    queryFn: () => getHotelReviews(id ?? '', page, size),
    enabled: Boolean(id) && enabled,
  })

export const useCreateHotelReview = (hotelId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateHotelReviewPayload) => createHotelReview(hotelId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-reviews', hotelId] })
      queryClient.invalidateQueries({ queryKey: hotelQueryKeys.detail(hotelId) })
    },
  })
}
