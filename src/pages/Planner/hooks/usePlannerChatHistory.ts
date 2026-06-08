import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/store/hooks'
import { restoreSession, setDynamicItineraries } from '@/store/plannerSlice'
import type { SavedPlannerSession } from '@/types/planner'
import { RECENT_EXPLORATIONS, PLANNER_I18N } from '../const'
import { suggestionsToItineraries } from '../utils'
import { deleteSavedSession, loadSavedSessions } from '../utils/sessionStorage'

export const usePlannerChatHistory = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [historyOpen, setHistoryOpen] = useState(false)
  const [savedSessions, setSavedSessions] = useState<SavedPlannerSession[]>([])

  const refreshHistory = useCallback(() => {
    const sessions = loadSavedSessions()
    setSavedSessions(sessions)
    return sessions
  }, [])

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
      setSavedSessions(deleteSavedSession(id))
    },
    [],
  )

  const getExplorationTitle = useCallback(
    (explorationId: SavedPlannerSession['explorationId']) => {
      const exploration = RECENT_EXPLORATIONS.find((item) => item.id === explorationId)
      return exploration ? t(exploration.titleKey) : explorationId
    },
    [t],
  )

  const formatDate = useCallback(
    (isoDate: string) => {
      try {
        return new Intl.DateTimeFormat(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(isoDate))
      } catch {
        return isoDate
      }
    },
    [],
  )

  return {
    historyOpen,
    openHistory,
    closeHistory,
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
