import dayjs, { type Dayjs } from 'dayjs'
import type { NavItem } from '@/components/layout/Header/const'
import type { DeviceType } from '@/services/appEventContext'
import { normalizeDeviceType } from '@/services/appEventContext'
import type { AppEvent } from '@/services/appEvents'
import type { Booking } from '@/types/booking'
import { formatCurrency } from '@/utils/currency'
import {
  ANALYTICS_I18N,
  CHART_COLORS,
  CUSTOM_EVENT_ACTION_KEYS,
  CUSTOM_EVENT_DETAIL_KEYS,
  DEVICE_TYPE_CONFIG,
  EVENT_TYPE_LABEL_KEYS,
  OTHER_PAGE_LABEL_KEY,
  ROUTE_LABEL_KEYS,
} from './const'
import type {
  AnalyticsDashboardData,
  AnalyticsDateRange,
  AnalyticsReport,
  DeviceStatItem,
  EventBreakdownSegment,
  KpiMetric,
  PageTrafficItem,
  PageViewTrendPoint,
  RankedStatItem,
  RecentAppEvent,
} from './types'

type DashboardBuildOptions = {
  bookings: Booking[]
  isAuthenticated: boolean
  locale: string
}

export const formatCompactCount = (count: number, locale: string): string => {
  if (count >= 1000) {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(count / 1000)}k`
  }
  return String(count)
}

export const buildLineChartPath = (
  values: number[],
  width: number,
  height: number,
  padding: number,
): string => {
  if (values.length === 0) return ''

  const max = Math.max(...values, 1)
  const min = 0
  const range = max - min || 1
  const innerWidth = width - padding * 2
  const innerHeight = height - padding * 2
  const stepX = innerWidth / Math.max(values.length - 1, 1)

  return values
    .map((value, index) => {
      const x = padding + index * stepX
      const y = padding + innerHeight - ((value - min) / range) * innerHeight
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

export const buildDonutSegments = (
  segments: { percent: number; color: string }[],
): { d: string; color: string }[] => {
  const radius = 40
  const innerRadius = 28
  let cumulative = 0

  return segments.map(({ percent, color }) => {
    const startAngle = (cumulative / 100) * 360 - 90
    cumulative += percent
    const endAngle = (cumulative / 100) * 360 - 90

    const startOuter = polarToCartesian(radius, startAngle)
    const endOuter = polarToCartesian(radius, endAngle)
    const startInner = polarToCartesian(innerRadius, endAngle)
    const endInner = polarToCartesian(innerRadius, startAngle)
    const largeArc = percent > 50 ? 1 : 0

    const d = [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
      `L ${startInner.x} ${startInner.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${endInner.x} ${endInner.y}`,
      'Z',
    ].join(' ')

    return { d, color }
  })
}

const polarToCartesian = (radius: number, angleDeg: number) => {
  const angleRad = (angleDeg * Math.PI) / 180
  return {
    x: 50 + radius * Math.cos(angleRad),
    y: 50 + radius * Math.sin(angleRad),
  }
}

export const toDateRangeValue = (range: AnalyticsDateRange): [Dayjs, Dayjs] => [
  dayjs(range.start),
  dayjs(range.end),
]

export const fromDateRangeValue = (
  dates: [Dayjs | null, Dayjs | null] | null,
): AnalyticsDateRange | null => {
  const startDate = dates?.[0]
  const endDate = dates?.[1]
  if (!startDate || !endDate) return null
  const [first, second] = startDate.isAfter(endDate)
    ? [endDate, startDate]
    : [startDate, endDate]
  return {
    start: first.format('YYYY-MM-DD'),
    end: second.format('YYYY-MM-DD'),
  }
}

const isInRange = (timestamp: string, start: Dayjs, end: Dayjs): boolean => {
  const date = dayjs(timestamp)
  return (
    date.isAfter(start.subtract(1, 'day'), 'day') && date.isBefore(end.add(1, 'day'), 'day')
  )
}

const filterByRange = (events: AppEvent[], range: AnalyticsDateRange): AppEvent[] => {
  const start = dayjs(range.start).startOf('day')
  const end = dayjs(range.end).endOf('day')
  return events.filter((event) => isInRange(event.timestamp, start, end))
}

const getPreviousRange = (range: AnalyticsDateRange): AnalyticsDateRange => {
  const start = dayjs(range.start)
  const end = dayjs(range.end)
  const days = end.diff(start, 'day') + 1
  const prevEnd = start.subtract(1, 'day')
  const prevStart = prevEnd.subtract(days - 1, 'day')
  return {
    start: prevStart.format('YYYY-MM-DD'),
    end: prevEnd.format('YYYY-MM-DD'),
  }
}

const calcTrend = (current: number, previous: number): KpiMetric['trend'] => {
  if (current === previous) {
    return { direction: 'steady', label: '0%' }
  }
  if (previous === 0) {
    return { direction: 'up', label: '100%' }
  }
  const change = ((current - previous) / previous) * 100
  const rounded = `${Math.abs(change).toFixed(1)}%`
  return {
    direction: change > 0 ? 'up' : 'down',
    label: rounded,
  }
}

const resolvePathLabelKey = (path?: string): string => {
  if (!path) return OTHER_PAGE_LABEL_KEY
  if (ROUTE_LABEL_KEYS[path]) return ROUTE_LABEL_KEYS[path]
  if (path.startsWith('/hotel/')) return 'pages.hotelDetail.title'
  if (path.startsWith('/guides/')) return 'nav.guides'
  return OTHER_PAGE_LABEL_KEY
}

const buildPageTraffic = (
  events: AppEvent[],
  navItems: NavItem[],
): PageTrafficItem[] => {
  const pageViews = events.filter((event) => event.type === 'page_view' && event.path)
  const total = pageViews.length || 1

  return navItems.map((item) => {
    const count = pageViews.filter((event) => {
      const path = event.path ?? ''
      if (item.path === '/') return path === '/'
      return path === item.path || path.startsWith(`${item.path}/`)
    }).length

    return {
      id: item.key,
      labelKey: item.labelKey,
      count,
      percent: Math.round((count / total) * 100),
    }
  })
}

const buildTopPages = (events: AppEvent[]): PageTrafficItem[] => {
  const pageViews = events.filter((event) => event.type === 'page_view' && event.path)
  const counts = new Map<string, number>()

  pageViews.forEach((event) => {
    const path = event.path ?? '/'
    counts.set(path, (counts.get(path) ?? 0) + 1)
  })

  const total = pageViews.length || 1
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([path, count]) => ({
      id: path,
      labelKey: resolvePathLabelKey(path),
      count,
      percent: Math.round((count / total) * 100),
    }))
}

const buildEventBreakdown = (events: AppEvent[]): EventBreakdownSegment[] => {
  const types = ['page_view', 'search', 'view_item', 'custom'] as const
  const total = events.length || 1
  const colors = [CHART_COLORS.primary, CHART_COLORS.accent, CHART_COLORS.accentDark, CHART_COLORS.muted]

  return types.map((type, index) => {
    const count = events.filter((event) => event.type === type).length
    return {
      id: type,
      labelKey: EVENT_TYPE_LABEL_KEYS[type],
      count,
      percent: Math.round((count / total) * 100),
      color: colors[index] ?? CHART_COLORS.muted,
    }
  }).filter((segment) => segment.count > 0)
}

const buildDailyTrends = (
  currentEvents: AppEvent[],
  previousEvents: AppEvent[],
  range: AnalyticsDateRange,
): PageViewTrendPoint[] => {
  const start = dayjs(range.start)
  const end = dayjs(range.end)
  const days = end.diff(start, 'day') + 1
  const bucketCount = Math.min(days, 12)
  const bucketSize = Math.ceil(days / bucketCount)

  return Array.from({ length: bucketCount }, (_, index) => {
    const bucketStart = start.add(index * bucketSize, 'day')
    const rawBucketEnd = bucketStart.add(bucketSize - 1, 'day')
    const bucketEnd = rawBucketEnd.isAfter(end) ? end : rawBucketEnd
    const prevBucketStart = bucketStart.subtract(days, 'day')
    const prevBucketEnd = bucketEnd.subtract(days, 'day')

    const countInBucket = (items: AppEvent[], from: Dayjs, to: Dayjs) =>
      items.filter(
        (event) =>
          event.type === 'page_view' &&
          isInRange(event.timestamp, from.startOf('day'), to.endOf('day')),
      ).length

    return {
      label: bucketStart.format('MMM D'),
      current: countInBucket(currentEvents, bucketStart, bucketEnd),
      previous: countInBucket(previousEvents, prevBucketStart, prevBucketEnd),
    }
  })
}

const buildSparkline = (events: AppEvent[], range: AnalyticsDateRange): number[] => {
  const end = dayjs(range.end).endOf('day')
  return Array.from({ length: 7 }, (_, index) => {
    const day = end.subtract(6 - index, 'day')
    return events.filter(
      (event) =>
        event.type === 'page_view' &&
        isInRange(event.timestamp, day.startOf('day'), day.endOf('day')),
    ).length
  })
}

const resolveRecentEventDisplay = (
  event: AppEvent,
): Pick<RecentAppEvent, 'pageLabelKey' | 'detailLabelKey' | 'detailValues' | 'path'> => {
  if (event.type === 'custom' && event.label) {
    const [action, start, end] = event.label.split(':')
    const pageLabelKey = CUSTOM_EVENT_ACTION_KEYS[action] ?? OTHER_PAGE_LABEL_KEY
    const detailLabelKey = CUSTOM_EVENT_DETAIL_KEYS[action]

    if (detailLabelKey && start && end) {
      return {
        pageLabelKey,
        detailLabelKey,
        detailValues: { start, end },
        path: event.label,
      }
    }

    return { pageLabelKey, path: event.label }
  }

  if (event.type === 'search' && event.label) {
    return {
      pageLabelKey: OTHER_PAGE_LABEL_KEY,
      path: event.label,
    }
  }

  return {
    pageLabelKey: resolvePathLabelKey(event.path),
    path: event.path ?? event.label ?? '—',
  }
}

const buildRecentEvents = (events: AppEvent[]): RecentAppEvent[] => {
  const now = dayjs()
  return [...events]
    .sort((a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf())
    .slice(0, 5)
    .map((event) => ({
      id: event.id,
      eventLabelKey: EVENT_TYPE_LABEL_KEYS[event.type],
      minutesAgo: Math.max(1, now.diff(dayjs(event.timestamp), 'minute')),
      ...resolveRecentEventDisplay(event),
    }))
}

const countUnique = (events: AppEvent[], pick: (event: AppEvent) => string | number | undefined) => {
  const values = events.map(pick).filter((value) => value !== undefined && value !== '')
  return new Set(values).size
}

const buildTopDestinations = (events: AppEvent[]): RankedStatItem[] => {
  const destinationEvents = events.filter(
    (event) => (event.type === 'view_item' || event.type === 'search') && event.label,
  )
  const counts = new Map<string, number>()

  destinationEvents.forEach((event) => {
    const label = event.label?.trim() ?? ''
    if (!label) return
    counts.set(label, (counts.get(label) ?? 0) + 1)
  })

  const total = destinationEvents.length || 1
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, count]) => ({
      id: label.toLowerCase().replace(/\s+/g, '-'),
      label,
      count,
      percent: Math.round((count / total) * 100),
    }))
}

const buildSessionMap = <T extends string>(
  events: AppEvent[],
  pick: (event: AppEvent) => T,
): Map<string, T> => {
  const map = new Map<string, T>()
  events.forEach((event) => {
    if (!map.has(event.sessionId)) {
      map.set(event.sessionId, pick(event))
    }
  })
  return map
}

const buildDeviceTypes = (events: AppEvent[]): DeviceStatItem[] => {
  const sessionDevices = buildSessionMap(events, (event) =>
    normalizeDeviceType(event.deviceType),
  )
  const total = sessionDevices.size || 1
  const counts = new Map<DeviceType, number>()

  sessionDevices.forEach((deviceType) => {
    counts.set(deviceType, (counts.get(deviceType) ?? 0) + 1)
  })

  return DEVICE_TYPE_CONFIG.map((device) => ({
    id: device.id,
    labelKey: device.labelKey,
    count: counts.get(device.id) ?? 0,
    percent: Math.round(((counts.get(device.id) ?? 0) / total) * 100),
    color: device.color,
  })).filter((item) => item.count > 0)
}

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

const buildBookingReport = (
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

const buildRevenueReport = (
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

const buildUserReport = (events: AppEvent[]): AnalyticsReport => ({
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

const buildKpis = (
  current: AppEvent[],
  previous: AppEvent[],
  range: AnalyticsDateRange,
): KpiMetric[] => {
  const pageViews = current.filter((event) => event.type === 'page_view')
  const prevPageViews = previous.filter((event) => event.type === 'page_view')
  const engagements = current.filter(
    (event) => event.type === 'search' || event.type === 'view_item',
  )
  const prevEngagements = previous.filter(
    (event) => event.type === 'search' || event.type === 'view_item',
  )

  const totalVisitors = countUnique(current, (event) => event.sessionId)
  const prevTotalVisitors = countUnique(previous, (event) => event.sessionId)
  const activeUsers = countUnique(current, (event) => event.userId)
  const prevActiveUsers = countUnique(previous, (event) => event.userId)

  const engagementRate =
    pageViews.length > 0 ? (engagements.length / pageViews.length) * 100 : 0
  const prevEngagementRate =
    prevPageViews.length > 0 ? (prevEngagements.length / prevPageViews.length) * 100 : 0

  const sparkline = buildSparkline(current, range)

  return [
    {
      id: 'totalVisitors',
      labelKey: ANALYTICS_I18N.kpis.totalVisitors,
      value: String(totalVisitors),
      trend: calcTrend(totalVisitors, prevTotalVisitors),
      sparkline,
    },
    {
      id: 'pageViews',
      labelKey: ANALYTICS_I18N.kpis.totalPageViews,
      value: String(pageViews.length),
      trend: calcTrend(pageViews.length, prevPageViews.length),
      sparkline,
    },
    {
      id: 'activeUsers',
      labelKey: ANALYTICS_I18N.kpis.activeUsers,
      value: String(activeUsers),
      trend: calcTrend(activeUsers, prevActiveUsers),
    },
    {
      id: 'engagement',
      labelKey: ANALYTICS_I18N.kpis.engagementRate,
      value: `${engagementRate.toFixed(1)}%`,
      trend: calcTrend(engagementRate, prevEngagementRate),
      badgeKey:
        engagementRate === prevEngagementRate ? ANALYTICS_I18N.kpis.steady : undefined,
    },
  ]
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
    bookingReport: buildBookingReport(options.bookings, range, options.isAuthenticated),
    revenueReport: buildRevenueReport(
      options.bookings,
      range,
      options.isAuthenticated,
      options.locale,
    ),
    userReport: buildUserReport(current),
    topPages: buildTopPages(current),
    recentEvents: buildRecentEvents(current),
  }
}

export const exportDashboardCsv = (
  data: AnalyticsDashboardData,
  range: AnalyticsDateRange,
): void => {
  const rows = [
    ['Metric', 'Value'],
    ...data.kpis.map((kpi) => [kpi.id, kpi.value]),
    [],
    ['Day', 'Current Period', 'Previous Period'],
    ...data.pageViewTrends.map((point) => [
      point.label,
      String(point.current),
      String(point.previous),
    ]),
    [],
    ['Menu Page', 'Views', 'Share %'],
    ...data.menuPageTraffic.map((item) => [
      item.id,
      String(item.count),
      String(item.percent),
    ]),
    [],
    ['Event Type', 'Count', 'Share %'],
    ...data.eventBreakdown.map((item) => [
      item.id,
      String(item.count),
      String(item.percent),
    ]),
    [],
    ['Destination', 'Interactions', 'Share %'],
    ...data.topDestinations.map((item) => [
      item.label,
      String(item.count),
      String(item.percent),
    ]),
    [],
    ['Device', 'Visitors', 'Share %'],
    ...data.deviceTypes.map((item) => [item.id, String(item.count), String(item.percent)]),
    [],
    ['Booking Report', 'Value'],
    ...data.bookingReport.items.map((item) => [item.id, item.value]),
    [],
    ['Revenue Report', 'Value'],
    ...data.revenueReport.items.map((item) => [item.id, item.value]),
    [],
    ['User Report', 'Value'],
    ...data.userReport.items.map((item) => [item.id, item.value]),
    [],
    ['Recent Event', 'Path', 'Minutes Ago'],
    ...data.recentEvents.map((event) => [
      event.id,
      event.path,
      String(event.minutesAgo),
    ]),
    [],
    ['Date Range', `${range.start} — ${range.end}`],
  ]

  const escapeCsvCell = (cell: string) =>
    /[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell

  const csv = rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `analytics-export-${range.start}-${range.end}.csv`
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
