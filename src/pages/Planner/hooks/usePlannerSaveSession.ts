import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/store/hooks'
import type { SavedPlannerSession } from '@/types/planner'
import { RECENT_EXPLORATIONS, PLANNER_I18N } from '../const'
import { findSavedSessionByToken, loadSavedSessions, upsertSavedSession } from '../utils/sessionStorage'

const truncate = (value: string, maxLength: number): string => {
  const trimmed = value.trim()
  if (trimmed.length <= maxLength) {
    return trimmed
  }
  return `${trimmed.slice(0, maxLength - 1)}…`
}

export const buildDefaultSessionTitle = (
  messages: SavedPlannerSession['messages'],
  explorationTitle: string,
): string => {
  const firstUserMessage = messages.find((message) => message.role === 'user')?.content
  if (firstUserMessage) {
    return truncate(firstUserMessage, 60)
  }
  return explorationTitle
}

export const usePlannerSaveSession = () => {
  const { t } = useTranslation()
  const plannerState = useAppSelector((state) => state.planner)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [savedSessions, setSavedSessions] = useState<SavedPlannerSession[]>([])

  const explorationTitle = t(
    RECENT_EXPLORATIONS.find((item) => item.id === plannerState.activeExplorationId)?.titleKey ??
      'pages.planner.title',
  )

  const defaultTitle = buildDefaultSessionTitle(plannerState.messages, explorationTitle)

  const refreshSavedSessions = useCallback(() => {
    const sessions = loadSavedSessions()
    setSavedSessions(sessions)
    return sessions
  }, [])

  const openSaveModal = useCallback(() => {
    refreshSavedSessions()
    setSaveModalOpen(true)
  }, [refreshSavedSessions])

  const closeSaveModal = useCallback(() => {
    setSaveModalOpen(false)
  }, [])

  const saveSession = useCallback(
    (title: string): SavedPlannerSession | null => {
      const trimmedTitle = title.trim()
      if (!trimmedTitle || plannerState.messages.length === 0) {
        return null
      }

      const now = new Date().toISOString()
      const existing = findSavedSessionByToken(plannerState.sessionToken)
      const session: SavedPlannerSession = {
        id: existing?.id ?? `saved_${Date.now()}`,
        title: trimmedTitle,
        explorationId: plannerState.activeExplorationId,
        sessionToken: plannerState.sessionToken,
        messages: plannerState.messages,
        appliedItineraries: plannerState.appliedItineraries,
        dynamicSuggestions: plannerState.dynamicSuggestions,
        savedAt: existing?.savedAt ?? now,
        updatedAt: now,
      }

      setSavedSessions(upsertSavedSession(session))
      setSaveModalOpen(false)
      return session
    },
    [plannerState],
  )

  const canSave = plannerState.messages.length > 0

  return {
    saveModalOpen,
    openSaveModal,
    closeSaveModal,
    saveSession,
    savedSessions,
    refreshSavedSessions,
    defaultTitle,
    canSave,
    saveEmptyHint: t(PLANNER_I18N.chat.saveEmptyHint),
    saveModalTitle: t(PLANNER_I18N.chat.saveModalTitle),
    saveModalLabel: t(PLANNER_I18N.chat.saveModalLabel),
    saveModalConfirm: t(PLANNER_I18N.chat.saveModalConfirm),
    saveModalCancel: t(PLANNER_I18N.chat.saveModalCancel),
    saveLabel: t(PLANNER_I18N.chat.save),
    saveSuccess: t(PLANNER_I18N.chat.saveSuccess),
  }
}
