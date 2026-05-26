import type { Dayjs } from 'dayjs'

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
  onBookNow?: () => void
  defaultCheckIn: Dayjs
  defaultCheckOut: Dayjs
  onDatesChange?: (checkIn: Dayjs | null, checkOut: Dayjs | null) => void
}
