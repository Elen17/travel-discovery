import {
  getAnalyticsUserId,
  getCountryForEvent,
  getDeviceType,
  getOrCreateSessionId,
  normalizeDeviceType,
  type DeviceType,
} from './appEventContext'

export type AppEventType = 'page_view' | 'search' | 'view_item' | 'custom'

export type AppEvent = {
  id: string
  type: AppEventType
  path?: string
  label?: string
  timestamp: string
  sessionId: string
  deviceType: DeviceType
  country: string
  userId?: number
}

const STORAGE_KEY = 'td_app_events'
const MAX_EVENTS = 1000

const readEvents = (): AppEvent[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isAppEvent).map(normalizeEvent)
  } catch {
    return []
  }
}

const normalizeEvent = (event: AppEvent): AppEvent => ({
  ...event,
  sessionId: event.sessionId ?? 'legacy',
  deviceType: normalizeDeviceType(event.deviceType),
  country: event.country ?? 'Unknown',
})

const isAppEvent = (value: unknown): value is AppEvent => {
  if (!value || typeof value !== 'object') return false
  const event = value as AppEvent
  return (
    typeof event.id === 'string' &&
    typeof event.type === 'string' &&
    typeof event.timestamp === 'string'
  )
}

const writeEvents = (events: AppEvent[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)))
  } catch {
    // localStorage may be unavailable
  }
}

export const recordAppEvent = (
  type: AppEventType,
  details?: { path?: string; label?: string },
): void => {
  const userId = getAnalyticsUserId()
  const event: AppEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    path: details?.path,
    label: details?.label,
    timestamp: new Date().toISOString(),
    sessionId: getOrCreateSessionId(),
    deviceType: getDeviceType(),
    country: getCountryForEvent(),
    ...(userId !== null ? { userId } : {}),
  }
  writeEvents([...readEvents(), event])
}

export const getAppEvents = (): AppEvent[] => readEvents()
