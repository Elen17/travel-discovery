import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import type { SavedPlannerSession } from '@/types/planner'
import { setPlanId } from '@/store/plannerSlice'
import { EXPLORATION_CONTENT, RECENT_EXPLORATIONS, PLANNER_I18N } from '../const'
import { buildPlannerPlanPayload, getExplorationContent, isBackendPlanId } from '../utils'
import { findSavedSessionByPlanId, loadSavedSessions, upsertSavedSession } from '../utils/sessionStorage'
import { useCreatePlannerPlan } from './usePlannerApi'

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
  const dispatch = useAppDispatch()
  const plannerState = useAppSelector((state) => state.planner)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const { createPlan } = useCreatePlannerPlan()
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
      const existing = findSavedSessionByPlanId(plannerState.planId)
      const resolvedPlanId = isBackendPlanId(plannerState.planId) ? plannerState.planId : null

      const session: SavedPlannerSession = {
        id: existing?.id ?? resolvedPlanId ?? `saved_${Date.now()}`,
        title: trimmedTitle,
        explorationId: plannerState.activeExplorationId,
        messages: plannerState.messages,
        appliedItineraries: plannerState.appliedItineraries,
        dynamicSuggestions: plannerState.dynamicSuggestions,
        savedAt: existing?.savedAt ?? now,
        updatedAt: now,
      }

      if (isAuthenticated) {
        const exploration = getExplorationContent(
          plannerState.activeExplorationId,
          EXPLORATION_CONTENT,
        )
        void createPlan(
          buildPlannerPlanPayload(
            trimmedTitle,
            plannerState.activeExplorationId,
            plannerState.messages,
            plannerState.appliedItineraries,
            exploration,
          ),
        ).then((plan) => {
          dispatch(setPlanId(plan.id))
        })
      } else {
        setSavedSessions(upsertSavedSession(session))
        dispatch(setPlanId(session.id))
      }

      setSaveModalOpen(false)
      return session
    },
    [createPlan, dispatch, isAuthenticated, plannerState],
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
