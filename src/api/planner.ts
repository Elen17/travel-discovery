import { apiClient } from '@/configs/axios'
import { mockGetPlannerHistory, mockSendPlannerMessage } from '@/api/planner.mock'
import type {
  PlannerChatPayload,
  PlannerChatResponse,
  PlannerMessage,
} from '@/types/planner'

export type { PlannerChatPayload, PlannerChatResponse, PlannerMessage }

export type PlannerChatResult = PlannerChatResponse & {
  fromMock: boolean
}

export const sendPlannerMessageHybrid = async (
  payload: PlannerChatPayload,
): Promise<PlannerChatResult> => {
  try {
    const { data } = await apiClient.post<PlannerChatResponse>('/planner/chat', payload)
    return { ...data, fromMock: false }
  } catch {
    const mockData = await mockSendPlannerMessage(payload)
    return { ...mockData, fromMock: true }
  }
}

export const getPlannerHistory = async (
  sessionToken?: string,
): Promise<PlannerMessage[]> => {
  try {
    const { data } = await apiClient.get<PlannerMessage[]>('/planner/history', {
      params: sessionToken ? { sessionToken } : undefined,
    })
    return data
  } catch {
    return mockGetPlannerHistory(sessionToken)
  }
}

export const sendPlannerMessage = sendPlannerMessageHybrid
