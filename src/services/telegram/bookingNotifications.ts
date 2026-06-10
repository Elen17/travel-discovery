import dayjs from 'dayjs'
import { formatCurrency } from '@/utils/currency'
import type { User } from '@/types/user'
import { sendMessage } from './index'

export type BookingAdminDetails = {
  hotelName: string
  hotelLocation?: string
  checkIn: string
  checkOut: string
  guestCount: number
  totalPrice: number
  currency?: string
  bookingId?: number
}

type BookingNotificationKind = 'checkout_started' | 'confirmed' | 'cancelled'

const NOTIFICATION_TITLES: Record<BookingNotificationKind, string> = {
  checkout_started: '🛒 Booking checkout started',
  confirmed: '✅ New booking confirmed',
  cancelled: '❌ Booking cancelled',
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const formatGuestLine = (user: User | null): string => {
  if (!user) {
    return '<b>Guest:</b> Unknown user'
  }

  return `<b>Guest:</b> ${escapeHtml(user.fullName)} (${escapeHtml(user.email)})\n<b>User ID:</b> ${user.id}`
}

const calculateNights = (checkIn: string, checkOut: string): number => {
  const nights = dayjs(checkOut).diff(dayjs(checkIn), 'day')
  return nights > 0 ? nights : 1
}

const formatBookingAdminMessage = (
  kind: BookingNotificationKind,
  details: BookingAdminDetails,
  user: User | null,
  locale = 'en',
): string => {
  const currency = details.currency ?? 'USD'
  const nights = calculateNights(details.checkIn, details.checkOut)
  const locationLine = details.hotelLocation
    ? `\n<b>Location:</b> ${escapeHtml(details.hotelLocation)}`
    : ''
  const bookingIdLine =
    details.bookingId !== undefined ? `\n<b>Booking ID:</b> ${details.bookingId}` : ''

  return [
    `<b>${NOTIFICATION_TITLES[kind]}</b>`,
    '',
    formatGuestLine(user),
    '',
    `<b>Hotel:</b> ${escapeHtml(details.hotelName)}${locationLine}`,
    `<b>Check-in:</b> ${escapeHtml(details.checkIn)}`,
    `<b>Check-out:</b> ${escapeHtml(details.checkOut)}`,
    `<b>Nights:</b> ${nights}`,
    `<b>Guests:</b> ${details.guestCount}`,
    `<b>Total:</b> ${escapeHtml(formatCurrency(details.totalPrice, currency, locale))}${bookingIdLine}`,
  ].join('\n')
}

const notifyAdminBooking = (
  kind: BookingNotificationKind,
  details: BookingAdminDetails,
  user: User | null,
  locale = 'en',
): void => {
  void sendMessage({
    text: formatBookingAdminMessage(kind, details, user, locale),
    parseMode: 'HTML',
  }).catch((error: unknown) => {
    console.warn('[telegram] booking notification failed:', error)
  })
}

export const notifyAdminBookingCheckoutStarted = (
  details: BookingAdminDetails,
  user: User | null,
  locale = 'en',
): void => {
  notifyAdminBooking('checkout_started', details, user, locale)
}

export const notifyAdminBookingConfirmed = (
  details: BookingAdminDetails,
  user: User | null,
  bookingId: number,
  locale = 'en',
): void => {
  notifyAdminBooking('confirmed', { ...details, bookingId }, user, locale)
}

export const notifyAdminBookingCancelled = (
  details: BookingAdminDetails,
  user: User | null,
  bookingId: number,
  locale = 'en',
): void => {
  notifyAdminBooking('cancelled', { ...details, bookingId }, user, locale)
}
