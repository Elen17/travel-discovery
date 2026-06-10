import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import type { PlannerChatResult } from '@/api/planner'
import { store } from '@/store'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  appendMessages,
  setAiSource,
  setDynamicItineraries,
  setDynamicSuggestions,
  setSessionToken,
} from '@/store/plannerSlice'
import { isGeminiConfigured, sendPlannerGeminiMessage } from '@/services/gemini'
import type { ExplorationId, PlannerSuggestion } from '@/types/planner'
import { PLANNER_I18N } from '../const'
import {
  buildGenerateInsightsPrompt,
  buildHotelContextPrompt,
  parsePlannerSearchParams,
  suggestionsToItineraries,
} from '../utils'

type SendMessageFn = (payload: {
  message: string
  sessionToken?: string
}) => Promise<PlannerChatResult>

type UsePlannerChatSendOptions = {
  activeExplorationId: ExplorationId
  sendMessage: SendMessageFn
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

export const usePlannerChatSend = ({
  activeExplorationId,
  sendMessage,
}: UsePlannerChatSendOptions) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const [isSending, setIsSending] = useState(false)
  const hasSentContextRef = useRef(false)
  const { messages, isHydrated } = useAppSelector((state) => state.planner)

  useEffect(() => {
    hasSentContextRef.current = false
  }, [activeExplorationId])

  const handleChatSend = useCallback(
    async (message: string) => {
      const userMessage = { role: 'user' as const, content: message }
      dispatch(appendMessages([userMessage]))
      setIsSending(true)

      const { sessionToken } = store.getState().planner

      try {
        if (isGeminiConfigured()) {
          try {
            const geminiResponse = await sendPlannerGeminiMessage(message, activeExplorationId)

            dispatch(appendMessages([{ role: 'assistant', content: geminiResponse.reply }]))
            applySuggestions(dispatch, geminiResponse.suggestions, activeExplorationId)
            dispatch(setAiSource('gemini'))
            return
          } catch {
            // Fall through to backend/mock via sendMessage
          }
        }

        const response = await sendMessage({
          message,
          sessionToken: sessionToken ?? undefined,
        })

        dispatch(setSessionToken(response.sessionToken))
        dispatch(appendMessages([{ role: 'assistant', content: response.reply }]))
        applySuggestions(dispatch, response.suggestions, activeExplorationId)
        dispatch(setAiSource(response.fromMock ? 'demo' : 'backend'))
      } catch {
        dispatch(setAiSource('demo'))
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
    [activeExplorationId, dispatch, sendMessage, t],
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
      void handleChatSend(buildHotelContextPrompt(parsed.hotelName, parsed.destination))
    }
  }, [handleChatSend, isHydrated, messages.length, searchParams])

  return { handleChatSend, handleGenerateInsights, isSending }
}
