export type BookingsPageProps = Record<string, never>

export type BookingTab = 'upcoming' | 'past' | 'cancelled'

export type BookingDisplayStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED'

export type BookingDisplay = {
  id: string
  hotelId: string
  hotelName: string
  city: string
  country: string
  checkIn: string
  checkOut: string
  guestCount: number
  roomTypeKey: string
  imageUrl: string
  status: BookingDisplayStatus
  tab: BookingTab
}

export type BookingStatusConfig = {
  status: BookingDisplayStatus
  labelKey: string
  dotClass: string
  badgeClass: string
}
