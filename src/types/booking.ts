export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export type Booking = {
  id: string
  hotelId: string
  hotelName: string
  checkIn: string
  checkOut: string
  guestCount: number
  totalPrice: number
  status: BookingStatus
  createdAt: string
}

export type CreateBookingPayload = {
  hotelId: string
  checkIn: string
  checkOut: string
  guestCount: number
}
