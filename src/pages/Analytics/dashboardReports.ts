import dayjs from 'dayjs'
import type { AppEvent } from '@/services/appEvents'
import type { Booking } from '@/types/booking'
import { formatCurrency } from '@/utils/currency'
import { ANALYTICS_I18N } from './const'
import { isInRange } from './dateRangeUtils'
import { countUnique } from './dashboardStats'
import type { AnalyticsDateRange, AnalyticsReport } from './types'

const filterBookingsByRange = (
  bookings: Booking[],
  range: AnalyticsDateRange,
): Booking[] => {
  const start = dayjs(range.start).startOf('day')
  const end = dayjs(range.end).endOf('day')
  return bookings.filter((booking) => isInRange(booking.createdAt, start, end))
}

const countPageViews = (events: AppEvent[], path: string): number =>
  events.filter((event) => event.type === 'page_view' && event.path === path).length

export const buildBookingReport = (
  bookings: Booking[],
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

  const filtered = filterBookingsByRange(bookings, range)
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

  const filtered = filterBookingsByRange(bookings, range)
  const confirmed = filtered.filter((booking) => booking.status === 'CONFIRMED')
  const totalRevenue = filtered.reduce((sum, booking) => sum + booking.totalPrice, 0)
  const confirmedRevenue = confirmed.reduce((sum, booking) => sum + booking.totalPrice, 0)
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
