import { apiClient } from '@/configs/axios'
import { isPlannerMockFallbackEnabled } from '@/configs/features'
import {
  mockCreatePlannerPlan,
  mockGetPlannerHistory,
  mockGetPlannerPlans,
  mockSendPlannerMessage,
} from '@/api/planner.mock'
import type {
  PlannerChatPayload,
  PlannerChatResponse,
  PlannerMessage,
  PlannerPlan,
  PlannerPlanPayload,
  PlannerSuggestion,
  ItineraryCategory,
} from '@/types/planner'
import { parseSuggestionsFromText } from '@/utils/plannerSuggestions'
import { toApiPlanId } from '@/utils/plannerPlanId'

const VALID_CATEGORIES = new Set<ItineraryCategory>(['nature', 'wellness', 'adventure'])

const parseSuggestionCategory = (value: string): ItineraryCategory =>
  VALID_CATEGORIES.has(value as ItineraryCategory) ? (value as ItineraryCategory) : 'nature'

const normalizeSuggestions = (suggestions?: PlannerSuggestion[]): PlannerSuggestion[] | undefined => {
  if (!suggestions) {
    return undefined
  }
  return suggestions.map((item) => ({
    ...item,
    category: parseSuggestionCategory(item.category),
  }))
}

export type { PlannerChatPayload, PlannerChatResponse, PlannerMessage, PlannerPlan, PlannerPlanPayload }

export type PlannerChatResult = PlannerChatResponse & {
  fromMock: boolean
}

type PlannerChatApiPayload = {
  message: string
  sessionToken?: string
  explorationId?: string
  role?: string
}

type PlannerChatApiResponse = {
  sessionToken: string
  reply: string
  suggestions?: PlannerSuggestion[]
}

const toApiChatPayload = (payload: PlannerChatPayload): PlannerChatApiPayload => ({
  message: payload.message,
  sessionToken: toApiPlanId(payload.planId),
  explorationId: payload.explorationId,
  role: payload.role,
})

const fromApiChatResponse = (data: PlannerChatApiResponse): PlannerChatResponse => {
  const reply = data.reply ?? ''
  return {
    reply,
    planId: data.sessionToken,
    suggestions:
      normalizeSuggestions(data.suggestions) ?? parseSuggestionsFromText(reply),
  }
}

export const sendPlannerMessage = async (
  payload: PlannerChatPayload,
): Promise<PlannerChatResponse> => {
  const { data } = await apiClient.post<PlannerChatApiResponse>('/planner/chat', toApiChatPayload(payload))
  return fromApiChatResponse(data)
}

/** Guest chat — local mock only, no backend calls. */
export const sendPlannerMessageGuest = async (
  payload: PlannerChatPayload,
): Promise<PlannerChatResult> => {
  const mockData = await mockSendPlannerMessage(payload)
  return { ...mockData, fromMock: true }
}

export const sendPlannerMessageHybrid = async (
  payload: PlannerChatPayload,
): Promise<PlannerChatResult> => {
  try {
    const data = await sendPlannerMessage(payload)
    return { ...data, fromMock: false }
  } catch (error) {
    if (!isPlannerMockFallbackEnabled()) {
      throw error
    }
    const mockData = await mockSendPlannerMessage(payload)
    return { ...mockData, fromMock: true }
  }
}

export const getPlannerHistory = async (planId: string): Promise<PlannerMessage[]> => {
  try {
    const { data } = await apiClient.get<PlannerMessage[]>('/planner/history', {
      params: { sessionToken: planId },
    })
    return data
  } catch (error) {
    if (!isPlannerMockFallbackEnabled()) {
      throw error
    }
    return mockGetPlannerHistory(planId)
  }
}

export const getPlannerPlans = async (): Promise<PlannerPlan[]> => {
  try {
    const { data } = await apiClient.get<PlannerPlan[]>('/planner/plans')
    return data
  } catch (error) {
    if (!isPlannerMockFallbackEnabled()) {
      throw error
    }
    return mockGetPlannerPlans()
  }
}

export const createPlannerPlan = async (payload: PlannerPlanPayload): Promise<PlannerPlan> => {
  try {
    const { data } = await apiClient.post<PlannerPlan>('/planner/plans', payload)
    return data
  } catch (error) {
    if (!isPlannerMockFallbackEnabled()) {
      throw error
    }
    return mockCreatePlannerPlan(payload)
  }
}
