import { PLANNER_SAVED_SESSIONS_KEY } from '@/store/planner/types'
import type { SavedPlannerSession } from '@/types/planner'

const MAX_SAVED_SESSIONS = 50

export const loadSavedSessions = (): SavedPlannerSession[] => {
  try {
    const raw = localStorage.getItem(PLANNER_SAVED_SESSIONS_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw) as SavedPlannerSession[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const persistSavedSessions = (sessions: SavedPlannerSession[]): void => {
  const sorted = [...sessions]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, MAX_SAVED_SESSIONS)
  localStorage.setItem(PLANNER_SAVED_SESSIONS_KEY, JSON.stringify(sorted))
}

export const upsertSavedSession = (session: SavedPlannerSession): SavedPlannerSession[] => {
  const existing = loadSavedSessions()
  const index = existing.findIndex((item) => item.id === session.id)
  const next =
    index >= 0
      ? existing.map((item, itemIndex) => (itemIndex === index ? session : item))
      : [session, ...existing]
  persistSavedSessions(next)
  return loadSavedSessions()
}

export const deleteSavedSession = (id: string): SavedPlannerSession[] => {
  const next = loadSavedSessions().filter((item) => item.id !== id)
  persistSavedSessions(next)
  return next
}

export const findSavedSessionByPlanId = (
  planId: string | null,
): SavedPlannerSession | undefined => {
  if (!planId) {
    return undefined
  }
  return loadSavedSessions().find((item) => item.id === planId)
}

export const findSavedSessionByToken = findSavedSessionByPlanId
