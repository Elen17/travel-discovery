export type ExplorationId = 'iceland' | 'tuscany' | 'kyoto' | 'amalfi'

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
  durationKey: string
  duration?: string
  category: ItineraryCategory
  appliedAt: string
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
  sessionToken?: string
  explorationId?: ExplorationId
}

export type PlannerChatResponse = {
  reply: string
  sessionToken: string
  suggestions?: PlannerSuggestion[]
}

export type GuestPlannerSession = {
  sessionToken: string
  explorationId: ExplorationId
  messages: PlannerMessage[]
  appliedItineraries: AppliedItinerary[]
  dynamicSuggestions: PlannerSuggestion[] | null
}
