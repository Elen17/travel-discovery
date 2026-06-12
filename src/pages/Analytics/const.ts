import dayjs from 'dayjs'
import type { NavItem } from '@/components/layout/Header/const'

export const ANALYTICS_I18N = {
  title: 'pages.analytics.title',
  subtitle: 'pages.analytics.subtitle',
  exportData: 'pages.analytics.exportData',
  empty: 'pages.analytics.empty',
  events: {
    dateChange: 'pages.analytics.events.dateChange',
    dateChangeDetail: 'pages.analytics.events.dateChangeDetail',
    export: 'pages.analytics.events.export',
    exportDetail: 'pages.analytics.events.exportDetail',
  },
  kpis: {
    totalVisitors: 'pages.analytics.kpis.totalVisitors',
    totalPageViews: 'pages.analytics.kpis.totalPageViews',
    activeUsers: 'pages.analytics.kpis.activeUsers',
    engagementRate: 'pages.analytics.kpis.engagementRate',
    steady: 'pages.analytics.kpis.steady',
  },
  charts: {
    pageViewTrends: {
      title: 'pages.analytics.charts.pageViewTrends.title',
      subtitle: 'pages.analytics.charts.pageViewTrends.subtitle',
      currentPeriod: 'pages.analytics.charts.pageViewTrends.currentPeriod',
      previousPeriod: 'pages.analytics.charts.pageViewTrends.previousPeriod',
    },
    menuPageTraffic: {
      title: 'pages.analytics.charts.menuPageTraffic.title',
    },
    eventBreakdown: {
      title: 'pages.analytics.charts.eventBreakdown.title',
      total: 'pages.analytics.charts.eventBreakdown.total',
      pageView: 'pages.analytics.charts.eventBreakdown.pageView',
      search: 'pages.analytics.charts.eventBreakdown.search',
      destinationView: 'pages.analytics.charts.eventBreakdown.destinationView',
      custom: 'pages.analytics.charts.eventBreakdown.custom',
    },
    topDestinations: {
      title: 'pages.analytics.charts.topDestinations.title',
      subtitle: 'pages.analytics.charts.topDestinations.subtitle',
    },
    deviceTypes: {
      title: 'pages.analytics.charts.deviceTypes.title',
      subtitle: 'pages.analytics.charts.deviceTypes.subtitle',
      mobile: 'pages.analytics.charts.deviceTypes.mobile',
      tablet: 'pages.analytics.charts.deviceTypes.tablet',
      desktop: 'pages.analytics.charts.deviceTypes.desktop',
    },
    reports: {
      booking: {
        title: 'pages.analytics.charts.reports.booking.title',
        subtitle: 'pages.analytics.charts.reports.booking.subtitle',
        total: 'pages.analytics.charts.reports.booking.total',
        confirmed: 'pages.analytics.charts.reports.booking.confirmed',
        upcoming: 'pages.analytics.charts.reports.booking.upcoming',
        cancelled: 'pages.analytics.charts.reports.booking.cancelled',
        loginRequired: 'pages.analytics.charts.reports.booking.loginRequired',
      },
      revenue: {
        title: 'pages.analytics.charts.reports.revenue.title',
        subtitle: 'pages.analytics.charts.reports.revenue.subtitle',
        total: 'pages.analytics.charts.reports.revenue.total',
        confirmed: 'pages.analytics.charts.reports.revenue.confirmed',
        average: 'pages.analytics.charts.reports.revenue.average',
        loginRequired: 'pages.analytics.charts.reports.revenue.loginRequired',
      },
      user: {
        title: 'pages.analytics.charts.reports.user.title',
        subtitle: 'pages.analytics.charts.reports.user.subtitle',
        visitors: 'pages.analytics.charts.reports.user.visitors',
        activeUsers: 'pages.analytics.charts.reports.user.activeUsers',
        profileViews: 'pages.analytics.charts.reports.user.profileViews',
        bookingsViews: 'pages.analytics.charts.reports.user.bookingsViews',
      },
    },
    topPages: {
      title: 'pages.analytics.charts.topPages.title',
      subtitle: 'pages.analytics.charts.topPages.subtitle',
      live: 'pages.analytics.charts.topPages.live',
    },
    recentEvents: {
      title: 'pages.analytics.charts.recentEvents.title',
      viewAll: 'pages.analytics.charts.recentEvents.viewAll',
      minutesAgo: 'pages.analytics.charts.recentEvents.minutesAgo',
      eventTypes: {
        pageView: 'pages.analytics.charts.recentEvents.eventTypes.pageView',
        search: 'pages.analytics.charts.recentEvents.eventTypes.search',
        destinationView: 'pages.analytics.charts.recentEvents.eventTypes.destinationView',
        custom: 'pages.analytics.charts.recentEvents.eventTypes.custom',
      },
    },
  },
} as const

export const DEFAULT_DATE_RANGE = {
  start: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
  end: dayjs().format('YYYY-MM-DD'),
} as const

export const CHART_COLORS = {
  primary: '#0d6e6e',
  accent: '#ff6b6b',
  accentDark: '#e05a4a',
  amber: '#f5a623',
  violet: '#6b5b95',
  sky: '#4a90a4',
  muted: 'rgba(26, 26, 46, 0.35)',
  secondary: 'rgba(13, 110, 110, 0.55)',
} as const

export const ANALYTICS_BAR_VARIANTS = [
  'barPrimary',
  'barAccent',
  'barAmber',
  'barViolet',
  'barSky',
  'barSecondary',
] as const

export const DEVICE_TYPE_CONFIG = [
  { id: 'mobile' as const, labelKey: ANALYTICS_I18N.charts.deviceTypes.mobile, color: CHART_COLORS.primary },
  { id: 'desktop' as const, labelKey: ANALYTICS_I18N.charts.deviceTypes.desktop, color: CHART_COLORS.accent },
  { id: 'tablet' as const, labelKey: ANALYTICS_I18N.charts.deviceTypes.tablet, color: CHART_COLORS.accentDark },
]

export const EVENT_TYPE_LABEL_KEYS = {
  page_view: ANALYTICS_I18N.charts.eventBreakdown.pageView,
  search: ANALYTICS_I18N.charts.eventBreakdown.search,
  view_item: ANALYTICS_I18N.charts.eventBreakdown.destinationView,
  custom: ANALYTICS_I18N.charts.eventBreakdown.custom,
} as const

export const ROUTE_LABEL_KEYS: Record<string, string> = {
  '/': 'nav.explore',
  '/destinations': 'nav.destinations',
  '/planner': 'nav.planner',
  '/bookings': 'nav.bookings',
  '/analytics': 'nav.analytics',
  '/guides': 'nav.guides',
  '/events': 'nav.events',
  '/profile': 'nav.profile',
  '/auth/login': 'nav.login',
}

export const OTHER_PAGE_LABEL_KEY = 'pages.analytics.charts.topPages.other'

export const CUSTOM_EVENT_ACTION_KEYS: Record<string, string> = {
  analytics_date_change: ANALYTICS_I18N.events.dateChange,
  analytics_export: ANALYTICS_I18N.events.export,
}

export const CUSTOM_EVENT_DETAIL_KEYS: Record<string, string> = {
  analytics_date_change: ANALYTICS_I18N.events.dateChangeDetail,
  analytics_export: ANALYTICS_I18N.events.exportDetail,
}

export const TRACKED_NAV_ITEMS: NavItem[] = [
  { key: 'explore', path: '/', labelKey: 'nav.explore' },
  { key: 'destinations', path: '/destinations', labelKey: 'nav.destinations' },
  { key: 'planner', path: '/planner', labelKey: 'nav.planner' },
  { key: 'bookings', path: '/bookings', labelKey: 'nav.bookings' },
  { key: 'analytics', path: '/analytics', labelKey: 'nav.analytics' },
]
