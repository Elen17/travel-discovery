import dayjs from 'dayjs'
import type { AppEvent } from '@/services/appEvents'
import {
  BOOKING_CANCELLED_PREFIX,
  BOOKING_CONFIRMED_PREFIX,
} from '@/services/analytics'
import type { Booking, BookingStatus } from '@/types/booking'
import { formatCurrency } from '@/utils/currency'
import { ANALYTICS_I18N } from './const'
import { isInRange } from './dateRangeUtils'
import { countUnique } from './dashboardStats'
import type { AnalyticsDateRange, AnalyticsReport } from './types'

const isBookingStatus = (value: string): value is BookingStatus =>
  value === 'PENDING' || value === 'CONFIRMED' || value === 'CANCELLED'

const getBookingRangeDate = (booking: Booking): string => {
  if (booking.createdAt && dayjs(booking.createdAt).isValid()) {
    return booking.createdAt
  }
  return booking.checkIn
}

const filterBookingsByRange = (
  bookings: Booking[],
  range: AnalyticsDateRange,
): Booking[] => {
  const start = dayjs(range.start).startOf('day')
  const end = dayjs(range.end).endOf('day')
  return bookings.filter((booking) => isInRange(getBookingRangeDate(booking), start, end))
}

const parseBookingsFromEvents = (events: AppEvent[]): Booking[] => {
  const bookings = new Map<number, Booking>()
  const sorted = [...events].sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  for (const event of sorted) {
    if (event.type !== 'custom' || !event.label) continue

    if (event.label.startsWith(BOOKING_CANCELLED_PREFIX)) {
      const bookingId = Number(event.label.slice(BOOKING_CANCELLED_PREFIX.length))
      if (Number.isNaN(bookingId)) continue
      const existing = bookings.get(bookingId)
      if (existing) {
        bookings.set(bookingId, { ...existing, status: 'CANCELLED' })
      }
      continue
    }

    if (!event.label.startsWith(BOOKING_CONFIRMED_PREFIX)) continue

    const payload = event.label.slice(BOOKING_CONFIRMED_PREFIX.length)
    const [idStr, priceStr, status, checkIn, checkOut] = payload.split('|')
    const id = Number(idStr)
    const totalPrice = Number(priceStr)
    if (Number.isNaN(id) || !checkIn || !checkOut) continue

    bookings.set(id, {
      id,
      hotelId: 0,
      checkIn,
      checkOut,
      guestCount: 1,
      totalPrice: Number.isNaN(totalPrice) ? 0 : totalPrice,
      status: status && isBookingStatus(status) ? status : 'CONFIRMED',
      createdAt: event.timestamp,
    })
  }

  return Array.from(bookings.values())
}

const mergeBookingsForReports = (apiBookings: Booking[], events: AppEvent[]): Booking[] => {
  const merged = new Map<number, Booking>()

  for (const booking of parseBookingsFromEvents(events)) {
    merged.set(booking.id, booking)
  }

  for (const booking of apiBookings) {
    const existing = merged.get(booking.id)
    merged.set(booking.id, {
      ...existing,
      ...booking,
      createdAt: booking.createdAt || existing?.createdAt || booking.checkIn,
    })
  }

  return Array.from(merged.values())
}

const countPageViews = (events: AppEvent[], path: string): number =>
  events.filter((event) => event.type === 'page_view' && event.path === path).length

export const buildBookingReport = (
  bookings: Booking[],
  events: AppEvent[],
  range: AnalyticsDateRange,
  isAuthenticated: boolean,
): AnalyticsReport => {
  const report: AnalyticsReport = {
    id: 'booking',
    titleKey: ANALYTICS_I18N.charts.reports.booking.title,
    subtitleKey: ANALYTICS_I18N.charts.reports.booking.subtitle,
    requiresAuth: true,
    items: [],
  }

  if (!isAuthenticated) return report

  const filtered = filterBookingsByRange(mergeBookingsForReports(bookings, events), range)
  const upcoming = filtered.filter(
    (booking) =>
      booking.status !== 'CANCELLED' &&
      dayjs(booking.checkOut).endOf('day').isAfter(dayjs()),
  )

  report.items = [
    {
      id: 'total',
      labelKey: ANALYTICS_I18N.charts.reports.booking.total,
      value: String(filtered.length),
    },
    {
      id: 'confirmed',
      labelKey: ANALYTICS_I18N.charts.reports.booking.confirmed,
      value: String(filtered.filter((booking) => booking.status === 'CONFIRMED').length),
    },
    {
      id: 'upcoming',
      labelKey: ANALYTICS_I18N.charts.reports.booking.upcoming,
      value: String(upcoming.length),
    },
    {
      id: 'cancelled',
      labelKey: ANALYTICS_I18N.charts.reports.booking.cancelled,
      value: String(filtered.filter((booking) => booking.status === 'CANCELLED').length),
    },
  ]

  return report
}

export const buildRevenueReport = (
  bookings: Booking[],
  events: AppEvent[],
  range: AnalyticsDateRange,
  isAuthenticated: boolean,
  locale: string,
): AnalyticsReport => {
  const report: AnalyticsReport = {
    id: 'revenue',
    titleKey: ANALYTICS_I18N.charts.reports.revenue.title,
    subtitleKey: ANALYTICS_I18N.charts.reports.revenue.subtitle,
    requiresAuth: true,
    items: [],
  }

  if (!isAuthenticated) return report

  const filtered = filterBookingsByRange(mergeBookingsForReports(bookings, events), range)
  const confirmed = filtered.filter((booking) => booking.status === 'CONFIRMED')
  const totalRevenue = filtered.reduce((sum, booking) => sum + (booking.totalPrice ?? 0), 0)
  const confirmedRevenue = confirmed.reduce((sum, booking) => sum + (booking.totalPrice ?? 0), 0)
  const average = filtered.length > 0 ? totalRevenue / filtered.length : 0

  report.items = [
    {
      id: 'total',
      labelKey: ANALYTICS_I18N.charts.reports.revenue.total,
      value: formatCurrency(totalRevenue, 'USD', locale),
    },
    {
      id: 'confirmed',
      labelKey: ANALYTICS_I18N.charts.reports.revenue.confirmed,
      value: formatCurrency(confirmedRevenue, 'USD', locale),
    },
    {
      id: 'average',
      labelKey: ANALYTICS_I18N.charts.reports.revenue.average,
      value: formatCurrency(average, 'USD', locale),
    },
  ]

  return report
}

export const buildUserReport = (events: AppEvent[]): AnalyticsReport => ({
  id: 'user',
  titleKey: ANALYTICS_I18N.charts.reports.user.title,
  subtitleKey: ANALYTICS_I18N.charts.reports.user.subtitle,
  items: [
    {
      id: 'visitors',
      labelKey: ANALYTICS_I18N.charts.reports.user.visitors,
      value: String(countUnique(events, (event) => event.sessionId)),
    },
    {
      id: 'activeUsers',
      labelKey: ANALYTICS_I18N.charts.reports.user.activeUsers,
      value: String(countUnique(events, (event) => event.userId)),
    },
    {
      id: 'profileViews',
      labelKey: ANALYTICS_I18N.charts.reports.user.profileViews,
      value: String(countPageViews(events, '/profile')),
    },
    {
      id: 'bookingsViews',
      labelKey: ANALYTICS_I18N.charts.reports.user.bookingsViews,
      value: String(countPageViews(events, '/bookings')),
    },
  ],
})
