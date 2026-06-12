import type { Dayjs } from 'dayjs'

export type HotelBookingFormData = {
  checkIn: Dayjs
  checkOut: Dayjs
  guestCount: number
}

export type HotelBookingCardProps = {
  pricePerNight: number
  priceLabel: string
  perNightLabel: string
  nights: number
  subtotal: number
  serviceFee: number
  taxes: number
  total: number
  formattedSubtotal: string
  formattedServiceFee: string
  formattedTaxes: string
  formattedTotal: string
  nightsLineLabel: string
  checkIn: Dayjs
  checkOut: Dayjs
  guestSelection: string
  onCheckInChange: (date: Dayjs | null) => void
  onCheckOutChange: (date: Dayjs | null) => void
  onGuestsChange: (selection: string) => void
  onBookNow?: (formData: HotelBookingFormData) => void | Promise<void>
  isSubmitting?: boolean
}
