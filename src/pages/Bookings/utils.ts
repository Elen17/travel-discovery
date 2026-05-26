import dayjs from 'dayjs'
import type { BookingDisplay, BookingTab } from './types'

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
