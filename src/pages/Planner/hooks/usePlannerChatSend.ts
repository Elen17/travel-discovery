import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import {
  sendPlannerMessage,
  sendPlannerMessageGuest,
  sendPlannerMessageHybrid,
} from '@/api/planner'
import { isPlannerMockFallbackEnabled } from '@/configs/features'
import { store } from '@/store'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  appendMessages,
  setAiSource,
  setDynamicItineraries,
  setDynamicSuggestions,
  setOfflineMode,
  setPlanId,
} from '@/store/plannerSlice'
import { isGeminiConfigured, sendPlannerGeminiMessage } from '@/services/gemini'
import type { ExplorationId, PlannerSuggestion } from '@/types/planner'
import { toApiPlanId } from '@/utils/plannerPlanId'
import {
  buildGenerateInsightsPrompt,
  buildHotelContextPrompt,
  parsePlannerSearchParams,
  suggestionsToItineraries,
  toChatPlanId,
} from '../utils'
import { PLANNER_I18N } from '../const'
import { plannerQueryKeys } from './usePlannerApi'

type UsePlannerChatSendOptions = {
  activeExplorationId: ExplorationId
}

const syncChatToBackend = async (
  userMessage: string,
  assistantReply: string,
  planId: string | null,
  explorationId: ExplorationId,
): Promise<string> => {
  const userResponse = await sendPlannerMessage({
    message: userMessage,
    planId: toApiPlanId(planId),
    explorationId,
    role: 'user',
  })

  await sendPlannerMessage({
    message: assistantReply,
    planId: userResponse.planId,
    explorationId,
    role: 'assistant',
  })

  return userResponse.planId
}

const applySuggestions = (
  dispatch: ReturnType<typeof useAppDispatch>,
  suggestions: PlannerSuggestion[] | undefined,
  explorationId: ExplorationId,
): void => {
  if (!suggestions || suggestions.length === 0) {
    return
  }
  dispatch(setDynamicSuggestions(suggestions))
  dispatch(setDynamicItineraries(suggestionsToItineraries(suggestions, explorationId)))
}

export const usePlannerChatSend = ({ activeExplorationId }: UsePlannerChatSendOptions) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const [isSending, setIsSending] = useState(false)
  const hasSentContextRef = useRef(false)
  const { messages, isHydrated } = useAppSelector((state) => state.planner)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  useEffect(() => {
    hasSentContextRef.current = false
  }, [activeExplorationId])

  const handleChatSend = useCallback(
    async (message: string) => {
      const userMessage = { role: 'user' as const, content: message }
      dispatch(appendMessages([userMessage]))
      setIsSending(true)

      const { planId } = store.getState().planner

      try {
        if (isGeminiConfigured()) {
          try {
            const geminiResponse = await sendPlannerGeminiMessage(message, activeExplorationId)

            dispatch(appendMessages([{ role: 'assistant', content: geminiResponse.reply }]))
            applySuggestions(dispatch, geminiResponse.suggestions, activeExplorationId)
            dispatch(setAiSource('gemini'))

            if (isAuthenticated) {
              try {
                const syncedPlanId = await syncChatToBackend(
                  message,
                  geminiResponse.reply,
                  planId,
                  activeExplorationId,
                )
                dispatch(setPlanId(syncedPlanId))
                dispatch(setOfflineMode(false))
                void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.plans })
              } catch {
                dispatch(setOfflineMode(true))
              }
            } else {
              dispatch(setOfflineMode(false))
            }

            return
          } catch {
            if (!isPlannerMockFallbackEnabled()) {
              throw new Error('Gemini request failed')
            }
          }
        }

        const chatPayload = {
          message,
          planId: toChatPlanId(planId),
          explorationId: activeExplorationId,
          role: 'user' as const,
        }

        const response = isAuthenticated
          ? await sendPlannerMessageHybrid(chatPayload)
          : await sendPlannerMessageGuest(chatPayload)

        dispatch(setPlanId(response.planId))
        dispatch(appendMessages([{ role: 'assistant', content: response.reply }]))
        applySuggestions(dispatch, response.suggestions, activeExplorationId)
        dispatch(setAiSource(response.fromMock ? 'demo' : 'backend'))
        dispatch(setOfflineMode(response.fromMock))

        if (!response.fromMock) {
          void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.plans })
        }
      } catch {
        dispatch(setAiSource('demo'))
        dispatch(setOfflineMode(true))
        dispatch(
          appendMessages([
            {
              role: 'assistant',
              content: t(PLANNER_I18N.chat.errorGeneric),
            },
          ]),
        )
      } finally {
        setIsSending(false)
      }
    },
    [activeExplorationId, dispatch, isAuthenticated, queryClient, t],
  )

  const handleGenerateInsights = useCallback(() => {
    if (isSending) {
      return
    }
    void handleChatSend(buildGenerateInsightsPrompt(activeExplorationId))
  }, [activeExplorationId, handleChatSend, isSending])

  useEffect(() => {
    if (hasSentContextRef.current || !isHydrated) {
      return
    }
    const parsed = parsePlannerSearchParams(searchParams)
    if (parsed.hotelName && parsed.destination && messages.length === 0) {
      hasSentContextRef.current = true
      const prompt = buildHotelContextPrompt(parsed.hotelName, parsed.destination)
      queueMicrotask(() => {
        void handleChatSend(prompt)
      })
    }
  }, [handleChatSend, isHydrated, messages.length, searchParams])

  return { handleChatSend, handleGenerateInsights, isSending }
}
