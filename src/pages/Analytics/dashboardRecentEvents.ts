import dayjs from 'dayjs'
import type { AppEvent } from '@/services/appEvents'
import {
  CUSTOM_EVENT_ACTION_KEYS,
  CUSTOM_EVENT_DETAIL_KEYS,
  EVENT_TYPE_LABEL_KEYS,
  OTHER_PAGE_LABEL_KEY,
  ROUTE_LABEL_KEYS,
} from './const'
import type { RecentAppEvent } from './types'

const resolvePathLabelKey = (path?: string): string => {
  if (!path) return OTHER_PAGE_LABEL_KEY
  if (ROUTE_LABEL_KEYS[path]) return ROUTE_LABEL_KEYS[path]
  if (path.startsWith('/hotel/')) return 'pages.hotelDetail.title'
  if (path.startsWith('/guides/')) return 'nav.guides'
  return OTHER_PAGE_LABEL_KEY
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

export const buildRecentEvents = (events: AppEvent[]): RecentAppEvent[] => {
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
