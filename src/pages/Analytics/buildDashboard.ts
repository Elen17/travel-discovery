import type { NavItem } from '@/components/layout/Header/const'
import type { AppEvent } from '@/services/appEvents'
import type { Booking } from '@/types/booking'
import { CHART_COLORS, DEVICE_TYPE_CONFIG, EVENT_TYPE_LABEL_KEYS } from './const'
import { buildKpis } from './dashboardKpis'
import {
  buildBookingReport,
  buildRevenueReport,
  buildUserReport,
} from './dashboardReports'
import { buildRecentEvents } from './dashboardRecentEvents'
import {
  buildDeviceTypes,
  buildEventBreakdown,
  buildPageTraffic,
  buildTopDestinations,
  buildTopPages,
} from './dashboardStats'
import { buildDailyTrends } from './dashboardTrends'
import { filterByRange, getPreviousRange } from './dateRangeUtils'
import type { AnalyticsDashboardData, AnalyticsDateRange } from './types'

type DashboardBuildOptions = {
  bookings: Booking[]
  isAuthenticated: boolean
  locale: string
}

export const buildDashboardFromEvents = (
  events: AppEvent[],
  range: AnalyticsDateRange,
  navItems: NavItem[],
  options: DashboardBuildOptions,
): AnalyticsDashboardData => {
  const current = filterByRange(events, range)
  const previous = filterByRange(events, getPreviousRange(range))
  const eventBreakdown = buildEventBreakdown(current)

  return {
    totalEvents: current.length,
    kpis: buildKpis(current, previous, range),
    pageViewTrends: buildDailyTrends(current, previous, range),
    menuPageTraffic: buildPageTraffic(current, navItems),
    eventBreakdown:
      eventBreakdown.length > 0
        ? eventBreakdown
        : [
            {
              id: 'page_view',
              labelKey: EVENT_TYPE_LABEL_KEYS.page_view,
              count: 0,
              percent: 100,
              color: CHART_COLORS.primary,
            },
          ],
    topDestinations: buildTopDestinations(current),
    deviceTypes: (() => {
      const devices = buildDeviceTypes(current)
      if (devices.length > 0) return devices
      return DEVICE_TYPE_CONFIG.map((device) => ({
        id: device.id,
        labelKey: device.labelKey,
        count: 0,
        percent: 0,
        color: device.color,
      }))
    })(),
    bookingReport: buildBookingReport(
      options.bookings,
      events,
      range,
      options.isAuthenticated,
    ),
    revenueReport: buildRevenueReport(
      options.bookings,
      events,
      range,
      options.isAuthenticated,
      options.locale,
    ),
    userReport: buildUserReport(current),
    topPages: buildTopPages(current),
    recentEvents: buildRecentEvents(current),
  }
}
