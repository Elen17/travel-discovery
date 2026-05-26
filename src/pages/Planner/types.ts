export type PlannerPageProps = Record<string, never>

export type PlannerExploration = {
  id: string
  titleKey: string
  metaKey: string
}

export type ItineraryCategory = 'nature' | 'wellness' | 'adventure'

export type SuggestedItinerary = {
  id: string
  titleKey: string
  descriptionKey: string
  imageUrl: string
  category: ItineraryCategory
  durationKey: string
}
