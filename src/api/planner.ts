/**
 * AI Planner endpoints are not yet available on the backend.
 * These types and stubs remain for the Planner UI until the API is implemented.
 */

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
