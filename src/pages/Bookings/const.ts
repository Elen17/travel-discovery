import type { BookingDisplay, BookingTab } from './types'

export const BOOKINGS_I18N = {
  title: 'pages.bookings.title',
  tabs: {
    upcoming: 'pages.bookings.tabs.upcoming',
    past: 'pages.bookings.tabs.past',
    cancelled: 'pages.bookings.tabs.cancelled',
  },
  card: {
    dates: 'pages.bookings.card.dates',
    defaultRoomType: 'pages.bookings.card.defaultRoomType',
    guestsRoom: 'pages.bookings.card.guestsRoom',
    getDirections: 'pages.bookings.card.getDirections',
    viewDetails: 'pages.bookings.card.viewDetails',
    status: {
      confirmed: 'pages.bookings.card.status.confirmed',
      pending: 'pages.bookings.card.status.pending',
      cancelled: 'pages.bookings.card.status.cancelled',
      completed: 'pages.bookings.card.status.completed',
    },
  },
  empty: 'pages.bookings.empty',
  loadError: 'pages.bookings.loadError',
  cta: {
    title: 'pages.bookings.cta.title',
    description: 'pages.bookings.cta.description',
    button: 'pages.bookings.cta.button',
  },
} as const

export const BOOKING_TABS: BookingTab[] = ['upcoming', 'past', 'cancelled']

export const STATUS_LABEL_KEYS: Record<
  BookingDisplay['status'],
  string
> = {
  CONFIRMED: BOOKINGS_I18N.card.status.confirmed,
  PENDING: BOOKINGS_I18N.card.status.pending,
  CANCELLED: BOOKINGS_I18N.card.status.cancelled,
  COMPLETED: BOOKINGS_I18N.card.status.completed,
}
