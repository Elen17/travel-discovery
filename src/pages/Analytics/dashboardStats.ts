import type { NavItem } from '@/components/layout/Header/const'
import type { DeviceType } from '@/services/appEventContext'
import { normalizeDeviceType } from '@/services/appEventContext'
import type { AppEvent } from '@/services/appEvents'
import {
  CHART_COLORS,
  DEVICE_TYPE_CONFIG,
  EVENT_TYPE_LABEL_KEYS,
  OTHER_PAGE_LABEL_KEY,
  ROUTE_LABEL_KEYS,
} from './const'
import type {
  DeviceStatItem,
  EventBreakdownSegment,
  PageTrafficItem,
  RankedStatItem,
} from './types'

export const countUnique = (
  events: AppEvent[],
  pick: (event: AppEvent) => string | number | undefined,
): number => {
  const values = events.map(pick).filter((value) => value !== undefined && value !== '')
  return new Set(values).size
}

const resolvePathLabelKey = (path?: string): string => {
  if (!path) return OTHER_PAGE_LABEL_KEY
  if (ROUTE_LABEL_KEYS[path]) return ROUTE_LABEL_KEYS[path]
  if (path.startsWith('/hotel/')) return 'pages.hotelDetail.title'
  if (path.startsWith('/guides/')) return 'nav.guides'
  return OTHER_PAGE_LABEL_KEY
}

export const buildPageTraffic = (
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

export const buildTopPages = (events: AppEvent[]): PageTrafficItem[] => {
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

export const buildEventBreakdown = (events: AppEvent[]): EventBreakdownSegment[] => {
  const types = ['page_view', 'search', 'view_item', 'custom'] as const
  const total = events.length || 1
  const colors = [CHART_COLORS.primary, CHART_COLORS.accent, CHART_COLORS.accentDark, CHART_COLORS.muted]

  return types
    .map((type, index) => {
      const count = events.filter((event) => event.type === type).length
      return {
        id: type,
        labelKey: EVENT_TYPE_LABEL_KEYS[type],
        count,
        percent: Math.round((count / total) * 100),
        color: colors[index] ?? CHART_COLORS.muted,
      }
    })
    .filter((segment) => segment.count > 0)
}

export const buildTopDestinations = (events: AppEvent[]): RankedStatItem[] => {
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

export const buildDeviceTypes = (events: AppEvent[]): DeviceStatItem[] => {
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
