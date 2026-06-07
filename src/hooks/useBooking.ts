import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBooking } from '@/api/bookings'
import type { CreateBookingPayload } from '@/types/booking'

export const bookingQueryKeys = {
  my: ['bookings', 'my'] as const,
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.my })
    },
  })
}
