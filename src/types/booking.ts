export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export type Booking = {
  id: number
  hotelId: number
  checkIn: string
  checkOut: string
  guestCount: number
  totalPrice: number
  status: BookingStatus
  createdAt: string
  hotelName?: string
}

export type CreateBookingPayload = {
  hotelId: number
  checkIn: string
  checkOut: string
  guestCount: number
  totalPrice: number
}
