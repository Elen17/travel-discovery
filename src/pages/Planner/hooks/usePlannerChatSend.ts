import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { sendPlannerMessage, sendPlannerMessageHybrid } from '@/api/planner'
import { store } from '@/store'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  appendMessages,
  setDynamicItineraries,
  setDynamicSuggestions,
  setOfflineMode,
  setPlanId,
} from '@/store/plannerSlice'
import { isGeminiConfigured, sendPlannerGeminiMessage } from '@/services/gemini'
import type { ExplorationId } from '@/types/planner'
import { toApiPlanId } from '@/utils/plannerPlanId'
import {
  buildGenerateInsightsPrompt,
  buildHotelContextPrompt,
  parsePlannerSearchParams,
  suggestionsToItineraries,
  toChatPlanId,
} from '../utils'
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

export const usePlannerChatSend = ({ activeExplorationId }: UsePlannerChatSendOptions) => {
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
          const geminiResponse = await sendPlannerGeminiMessage(message, activeExplorationId)

          dispatch(appendMessages([{ role: 'assistant', content: geminiResponse.reply }]))

          if (geminiResponse.suggestions) {
            dispatch(setDynamicSuggestions(geminiResponse.suggestions))
            dispatch(
              setDynamicItineraries(
                suggestionsToItineraries(geminiResponse.suggestions, activeExplorationId),
              ),
            )
          }

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
        }

        const response = await sendPlannerMessageHybrid({
          message,
          planId: toChatPlanId(planId),
          explorationId: activeExplorationId,
          role: 'user',
        })

        dispatch(setPlanId(response.planId))
        dispatch(appendMessages([{ role: 'assistant', content: response.reply }]))

        if (response.suggestions) {
          dispatch(setDynamicSuggestions(response.suggestions))
          dispatch(
            setDynamicItineraries(
              suggestionsToItineraries(response.suggestions, activeExplorationId),
            ),
          )
        } else {
          dispatch(setDynamicSuggestions(null))
          dispatch(setDynamicItineraries(null))
        }

        dispatch(setOfflineMode(response.fromMock))
        if (!response.fromMock) {
          void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.plans })
        }
      } catch {
        dispatch(setOfflineMode(true))
      } finally {
        setIsSending(false)
      }
    },
    [activeExplorationId, dispatch, isAuthenticated, queryClient],
  )

  const handleGenerateInsights = useCallback(() => {
    void handleChatSend(buildGenerateInsightsPrompt(activeExplorationId))
  }, [activeExplorationId, handleChatSend])

  useEffect(() => {
    if (hasSentContextRef.current || !isHydrated) {
      return
    }
    const parsed = parsePlannerSearchParams(searchParams)
    if (parsed.hotelName && parsed.destination && messages.length === 0) {
      hasSentContextRef.current = true
      void handleChatSend(buildHotelContextPrompt(parsed.hotelName, parsed.destination))
    }
  }, [handleChatSend, isHydrated, messages.length, searchParams])

  return { handleChatSend, handleGenerateInsights, isSending }
}
