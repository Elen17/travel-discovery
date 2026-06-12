import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { restoreSession, setDynamicItineraries } from '@/store/plannerSlice'
import type { SavedPlannerSession } from '@/types/planner'
import { PLANNER_I18N, RECENT_EXPLORATIONS } from '../const'
import { plannerPlanToSavedSession, suggestionsToItineraries } from '../utils'
import { deleteSavedSession, loadSavedSessions } from '../utils/sessionStorage'
import { usePlannerPlans } from './usePlannerApi'

export const usePlannerChatHistory = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [guestSessionsVersion, setGuestSessionsVersion] = useState(0)
  const [trackedAuth, setTrackedAuth] = useState(isAuthenticated)

  if (trackedAuth !== isAuthenticated) {
    setTrackedAuth(isAuthenticated)
    if (!isAuthenticated) {
      setGuestSessionsVersion((version) => version + 1)
    }
  }

  const { data: backendPlans = [], refetch: refetchPlans } = usePlannerPlans()

  const savedSessions = useMemo(() => {
    if (backendPlans.length > 0) {
      return backendPlans.map(plannerPlanToSavedSession)
    }
    void guestSessionsVersion
    return loadSavedSessions()
  }, [backendPlans, guestSessionsVersion])

  const refreshHistory = useCallback(async () => {
    const { data } = await refetchPlans()
    const plans = data ?? []
    if (plans.length > 0) {
      return plans.map(plannerPlanToSavedSession)
    }

    const sessions = loadSavedSessions()
    setGuestSessionsVersion((version) => version + 1)
    return sessions
  }, [refetchPlans])

  const openHistory = useCallback(() => {
    refreshHistory()
    setHistoryOpen(true)
  }, [refreshHistory])

  const closeHistory = useCallback(() => {
    setHistoryOpen(false)
  }, [])

  const restoreSavedSession = useCallback(
    (session: SavedPlannerSession) => {
      dispatch(restoreSession(session))
      if (session.dynamicSuggestions) {
        dispatch(
          setDynamicItineraries(
            suggestionsToItineraries(session.dynamicSuggestions, session.explorationId),
          ),
        )
      } else {
        dispatch(setDynamicItineraries(null))
      }
      setHistoryOpen(false)
    },
    [dispatch],
  )

  const removeSavedSession = useCallback(
    (id: string) => {
      if (isAuthenticated) {
        return
      }
      deleteSavedSession(id)
      setGuestSessionsVersion((version) => version + 1)
    },
    [isAuthenticated],
  )

  const getExplorationTitle = useCallback(
    (explorationId: SavedPlannerSession['explorationId']) => {
      const exploration = RECENT_EXPLORATIONS.find((item) => item.id === explorationId)
      return exploration ? t(exploration.titleKey) : explorationId
    },
    [t],
  )

  const formatDate = useCallback((isoDate: string) => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(isoDate))
    } catch {
      return isoDate
    }
  }, [])

  return {
    historyOpen,
    openHistory,
    closeHistory,
    refreshHistory,
    savedSessions,
    restoreSavedSession,
    removeSavedSession,
    getExplorationTitle,
    formatDate,
    historyLabel: t(PLANNER_I18N.chat.history),
    historyTitle: t(PLANNER_I18N.chat.historyTitle),
    historyEmpty: t(PLANNER_I18N.chat.historyEmpty),
    historyRestore: t(PLANNER_I18N.chat.historyRestore),
    historyDelete: t(PLANNER_I18N.chat.historyDelete),
    historyMessages: t(PLANNER_I18N.chat.historyMessages),
    historyPlans: t(PLANNER_I18N.chat.historyPlans),
    historyClose: t(PLANNER_I18N.drawer.close),
  }
}
