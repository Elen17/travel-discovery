import { useQueries, useQuery } from '@tanstack/react-query'
import { getMyBookings } from '@/api/bookings'
import { getHotelById } from '@/api/hotels'

export const bookingsQueryKeys = {
  myBookings: (page?: number, size?: number) => ['bookings', 'mine', page, size] as const,
  hotel: (id: number) => ['hotels', id] as const,
}

type UseMyBookingsOptions = {
  enabled?: boolean
  page?: number
  size?: number
}

export const useMyBookings = ({
  enabled = true,
  page = 0,
  size = 50,
}: UseMyBookingsOptions = {}) =>
  useQuery({
    queryKey: bookingsQueryKeys.myBookings(page, size),
    queryFn: () => getMyBookings({ page, size }),
    enabled,
  })

export const useBookingHotels = (hotelIds: number[], enabled = true) =>
  useQueries({
    queries: hotelIds.map((id) => ({
      queryKey: bookingsQueryKeys.hotel(id),
      queryFn: () => getHotelById(String(id)),
      enabled: enabled && id > 0,
    })),
  })
