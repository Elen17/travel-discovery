import { useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { PlannerChatResult } from '@/api/planner'
import { store } from '@/store'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  appendMessages,
  setDynamicItineraries,
  setDynamicSuggestions,
  setOfflineMode,
  setSessionToken,
} from '@/store/plannerSlice'
import type { ExplorationId } from '@/types/planner'
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

export const usePlannerChatSend = ({
  activeExplorationId,
  sendMessage,
}: UsePlannerChatSendOptions) => {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const hasSentContextRef = useRef(false)
  const { messages, isHydrated } = useAppSelector((state) => state.planner)

  useEffect(() => {
    hasSentContextRef.current = false
  }, [activeExplorationId])

  const handleChatSend = useCallback(
    async (message: string) => {
      const userMessage = { role: 'user' as const, content: message }
      dispatch(appendMessages([userMessage]))

      const { sessionToken } = store.getState().planner

      try {
        const response = await sendMessage({
          message,
          sessionToken: sessionToken ?? undefined,
        })

        dispatch(setSessionToken(response.sessionToken))
        dispatch(appendMessages([{ role: 'assistant', content: response.reply }]))

        if (response.suggestions) {
          dispatch(setDynamicSuggestions(response.suggestions))
          dispatch(
            setDynamicItineraries(
              suggestionsToItineraries(response.suggestions, activeExplorationId),
            ),
          )
        }

        dispatch(setOfflineMode(response.fromMock))
      } catch {
        dispatch(setOfflineMode(true))
      }
    },
    [activeExplorationId, dispatch, sendMessage],
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

  return { handleChatSend, handleGenerateInsights }
}
