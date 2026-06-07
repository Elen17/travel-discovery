import type { DeviceType } from '@/services/appEventContext'

export type KpiTrendDirection = 'up' | 'down' | 'steady'

export type KpiMetric = {
  id: string
  labelKey: string
  value: string
  trend?: {
    direction: KpiTrendDirection
    label: string
  }
  badgeKey?: string
  sparkline?: number[]
}

export type PageViewTrendPoint = {
  label: string
  current: number
  previous: number
}

export type PageTrafficItem = {
  id: string
  labelKey: string
  count: number
  percent: number
}

export type RankedStatItem = {
  id: string
  label: string
  count: number
  percent: number
}

export type DeviceStatItem = {
  id: DeviceType
  labelKey: string
  count: number
  percent: number
  color: string
}

export type EventBreakdownSegment = {
  id: string
  labelKey: string
  count: number
  percent: number
  color: string
}

export type ReportStatItem = {
  id: string
  labelKey: string
  value: string
}

export type AnalyticsReport = {
  id: string
  titleKey: string
  subtitleKey: string
  items: ReportStatItem[]
  requiresAuth?: boolean
}

export type RecentAppEvent = {
  id: string
  pageLabelKey: string
  eventLabelKey: string
  detailLabelKey?: string
  detailValues?: Record<string, string>
  path: string
  minutesAgo: number
}

export type AnalyticsDateRange = {
  start: string
  end: string
}

export type AnalyticsDashboardData = {
  kpis: KpiMetric[]
  pageViewTrends: PageViewTrendPoint[]
  menuPageTraffic: PageTrafficItem[]
  eventBreakdown: EventBreakdownSegment[]
  topDestinations: RankedStatItem[]
  deviceTypes: DeviceStatItem[]
  bookingReport: AnalyticsReport
  revenueReport: AnalyticsReport
  userReport: AnalyticsReport
  topPages: PageTrafficItem[]
  recentEvents: RecentAppEvent[]
  totalEvents: number
}
