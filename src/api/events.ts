import { apiClient } from '@/configs/axios'

export type SubscribeToEventsPayload = {
  email: string
}

export type SubscribeToEventsResponse = {
  message: string
}

export const subscribeToEvents = async (
  payload: SubscribeToEventsPayload,
): Promise<SubscribeToEventsResponse> => {
  const { data } = await apiClient.post<SubscribeToEventsResponse>('/events/subscribe', payload)
  return data
}
