import { apiClient } from '@/configs/axios'

export type PlannerMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type PlannerChatPayload = {
  message: string
  sessionToken?: string
}

export type PlannerChatResponse = {
  reply: string
  sessionToken: string
}

export const sendPlannerMessage = async (
  payload: PlannerChatPayload,
): Promise<PlannerChatResponse> => {
  const { data } = await apiClient.post<PlannerChatResponse>('/planner/chat', payload)
  return data
}

export const getPlannerHistory = async (): Promise<PlannerMessage[]> => {
  const { data } = await apiClient.get<PlannerMessage[]>('/planner/history')
  return data
}
