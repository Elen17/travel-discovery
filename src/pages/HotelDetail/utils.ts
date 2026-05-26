import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { MOCK_HOTEL_DETAILS } from './const'
import type { BookingSummary, HotelDetailData } from './types'

export const getHotelDetailById = (id: string | undefined): HotelDetailData | null => {
  if (!id) return null
  return MOCK_HOTEL_DETAILS[id] ?? null
}

export const calculateNights = (
  checkIn: Dayjs | null,
  checkOut: Dayjs | null,
  fallback: number,
): number => {
  if (!checkIn || !checkOut) return fallback
  const nights = checkOut.diff(checkIn, 'day')
  return nights > 0 ? nights : fallback
}

export const calculateBookingSummary = (
  hotel: HotelDetailData,
  nights: number,
): BookingSummary => {
  const subtotal = hotel.pricePerNight * nights
  const serviceFee = hotel.serviceFee
  const taxes = Math.round(subtotal * hotel.occupancyTaxRate)
  const total = subtotal + serviceFee + taxes

  return { nights, subtotal, serviceFee, taxes, total }
}

export const getDefaultDates = (nights: number): { checkIn: Dayjs; checkOut: Dayjs } => {
  const checkIn = dayjs().add(14, 'day')
  const checkOut = checkIn.add(nights, 'day')
  return { checkIn, checkOut }
}
