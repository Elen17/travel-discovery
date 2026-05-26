import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Booking } from '@/types/booking'

export type BookingState = {
  selectedBookingId: string | null
  recentBookings: Booking[]
}

const initialState: BookingState = {
  selectedBookingId: null,
  recentBookings: [],
}

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedBookingId: (state, action: PayloadAction<string | null>) => {
      state.selectedBookingId = action.payload
    },
    setRecentBookings: (state, action: PayloadAction<Booking[]>) => {
      state.recentBookings = action.payload
    },
  },
})

export const { setSelectedBookingId, setRecentBookings } = bookingSlice.actions
export default bookingSlice.reducer
