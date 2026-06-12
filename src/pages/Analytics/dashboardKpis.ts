import type { AppEvent } from '@/services/appEvents'
import { ANALYTICS_I18N } from './const'
import { countUnique } from './dashboardStats'
import { buildSparkline } from './dashboardTrends'
import type { AnalyticsDateRange, KpiMetric } from './types'

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

export const buildKpis = (
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
