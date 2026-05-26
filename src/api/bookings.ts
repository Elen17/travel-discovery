import { apiClient } from '@/configs/axios'
import type { Booking, CreateBookingPayload } from '@/types/booking'

export const getMyBookings = async (): Promise<Booking[]> => {
  const { data } = await apiClient.get<Booking[]>('/bookings/my')
  return data
}

export const createBooking = async (payload: CreateBookingPayload): Promise<Booking> => {
  const { data } = await apiClient.post<Booking>('/bookings', payload)
  return data
}

export const cancelBooking = async (id: string): Promise<Booking> => {
  const { data } = await apiClient.put<Booking>(`/bookings/${id}/cancel`)
  return data
}
