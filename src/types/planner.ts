export type ExplorationId = string

export type ItineraryCategory = 'nature' | 'wellness' | 'adventure'

export type PlannerMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type SuggestedItinerary = {
  id: string
  titleKey: string
  descriptionKey: string
  imageUrl: string
  category: ItineraryCategory
  durationKey: string
  stepKeys?: string[]
  title?: string
  description?: string
  duration?: string
  steps?: string[]
}

export type AppliedItinerary = {
  id: string
  titleKey: string
  title?: string
  description?: string
  durationKey: string
  duration?: string
  category: ItineraryCategory
  appliedAt: string
}

export type PlannerAppliedItineraryItem = {
  title: string
  description?: string
}

export type PlannerAppliedItinerary = {
  id: number
  title: string
  description?: string
}

export type PlannerExploration = {
  id: ExplorationId
  titleKey: string
  metaKey: string
}

export type ExplorationTripContent = {
  eyebrowKey: string
  titleKey: string
  datesKey: string
  travelersKey: string
}

export type ExplorationContent = {
  id: ExplorationId
  heroImage: string
  trip: ExplorationTripContent
  suggestedItineraries: SuggestedItinerary[]
}

export type PlannerSearchParams = {
  exploration?: ExplorationId
  destination?: string
  hotelId?: string
  hotelName?: string
  dates?: string
  guests?: string
  session?: string
}

export type PlannerSuggestion = {
  id: string
  title: string
  category: ItineraryCategory
  duration: string
  description?: string
  steps?: string[]
}

export type PlannerChatPayload = {
  message: string
  planId?: string
  explorationId?: ExplorationId
  role?: PlannerMessage['role']
}

export type PlannerChatResponse = {
  reply: string
  planId: string
  suggestions?: PlannerSuggestion[]
}

export type PlannerStoredSession = {
  planId: string | null
  explorationId: ExplorationId
  messages: PlannerMessage[]
  appliedItineraries: AppliedItinerary[]
  dynamicSuggestions: PlannerSuggestion[] | null
}

export type PlannerPlanPayload = {
  title?: string
  description?: string
  explorationId?: string
  duration?: number
  type?: string
  travelersCount?: number
  imageUrl?: string
  messages?: PlannerMessage[]
  appliedItineraries?: PlannerAppliedItineraryItem[]
}

export type ActivePlannerPlan = {
  id: string
  title: string
  imageUrl?: string
  explorationId: ExplorationId
  duration?: number
  travelersCount?: number
  type?: string
}

export type LoadPlanPayload = {
  planId: string
  explorationId: ExplorationId
  messages: PlannerMessage[]
  appliedItineraries: AppliedItinerary[]
  title: string
  imageUrl?: string
  duration?: number
  travelersCount?: number
  type?: string
}

export type PlannerPlan = {
  id: string
  title: string
  description?: string
  explorationId: string
  duration?: number
  type?: string
  travelersCount?: number
  imageUrl?: string
  createdAt: string
  updatedAt: string
  messages: PlannerMessage[]
  appliedItineraries: PlannerAppliedItinerary[]
}

export type SavedPlannerSession = {
  id: string
  title: string
  explorationId: ExplorationId
  messages: PlannerMessage[]
  appliedItineraries: AppliedItinerary[]
  dynamicSuggestions: PlannerSuggestion[] | null
  savedAt: string
  updatedAt: string
}
