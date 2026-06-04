import { apiClient } from '@/configs/axios'
import type { PageParams, PageResponse } from '@/types/api'
import type { Booking, CreateBookingPayload } from '@/types/booking'

export const getMyBookings = async (
  params?: PageParams,
): Promise<PageResponse<Booking>> => {
  const { data } = await apiClient.get<PageResponse<Booking>>('/bookings', { params })
  return data
}

export const createBooking = async (payload: CreateBookingPayload): Promise<Booking> => {
  const { data } = await apiClient.post<Booking>('/bookings', payload)
  return data
}

export const cancelBooking = async (id: number): Promise<Booking> => {
  const { data } = await apiClient.delete<Booking>(`/bookings/${id}`)
  return data
}
