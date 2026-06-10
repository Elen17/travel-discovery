import dayjs from 'dayjs'
import type { Booking } from '@/types/booking'
import type { Hotel } from '@/types/hotel'
import { BOOKINGS_I18N } from './const'
import type { BookingDisplay, BookingDisplayStatus, BookingTab } from './types'

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099f29?auto=format&fit=crop&w=400&q=80'

export const resolveBookingTab = (booking: Booking): BookingTab => {
  if (booking.status === 'CANCELLED') return 'cancelled'
  if (dayjs(booking.checkOut).endOf('day').isBefore(dayjs())) return 'past'
  return 'upcoming'
}

export const resolveDisplayStatus = (booking: Booking): BookingDisplayStatus => {
  if (booking.status === 'CANCELLED') return 'CANCELLED'
  if (dayjs(booking.checkOut).endOf('day').isBefore(dayjs())) return 'COMPLETED'
  if (booking.status === 'CONFIRMED') return 'CONFIRMED'
  return 'PENDING'
}

export const mapBookingToDisplay = (booking: Booking, hotel?: Hotel): BookingDisplay => ({
  id: String(booking.id),
  hotelId: String(booking.hotelId),
  hotelName: hotel?.name ?? `Hotel #${booking.hotelId}`,
  city: hotel?.city ?? '',
  country: hotel?.country ?? '',
  checkIn: booking.checkIn,
  checkOut: booking.checkOut,
  guestCount: booking.guestCount,
  roomTypeKey: BOOKINGS_I18N.card.defaultRoomType,
  imageUrl: hotel?.mainImageUrl ?? PLACEHOLDER_IMAGE,
  status: resolveDisplayStatus(booking),
  tab: resolveBookingTab(booking),
})

export const mapBookingsToDisplay = (
  bookings: Booking[],
  hotelsById: Map<number, Hotel>,
): BookingDisplay[] =>
  bookings.map((booking) => mapBookingToDisplay(booking, hotelsById.get(booking.hotelId)))

const localeMap: Record<string, string> = {
  en: 'en',
  hy: 'hy-am',
  ru: 'ru',
}

export const filterBookingsByTab = (
  bookings: BookingDisplay[],
  tab: BookingTab,
): BookingDisplay[] => {
  return bookings.filter((booking) => booking.tab === tab)
}

export const formatBookingDateRange = (
  checkIn: string,
  checkOut: string,
  locale = 'en',
): string => {
  const dayjsLocale = localeMap[locale] ?? 'en'
  const start = dayjs(checkIn).locale(dayjsLocale)
  const end = dayjs(checkOut).locale(dayjsLocale)

  if (start.year() === end.year()) {
    return `${start.format('MMM D')} — ${end.format('MMM D, YYYY')}`
  }

  return `${start.format('MMM D, YYYY')} — ${end.format('MMM D, YYYY')}`
}
