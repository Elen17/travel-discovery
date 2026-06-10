export type {
  ExplorationId,
  ItineraryCategory,
  PlannerExploration,
  SuggestedItinerary,
} from '@/types/planner'

export type PlannerPageProps = Record<string, never>

export type TripPlanPdfItinerary = {
  title: string
  description: string
  category: string
  duration: string
  stepsLabel: string
  steps: string[]
}

export type TripPlanPdfContent = {
  documentTitle: string
  tripTitle: string
  tripDates: string
  tripTravelers: string
  appliedSectionTitle: string
  appliedItems: { title: string; meta: string }[]
  itinerariesSectionTitle: string
  itinerariesSubtitle: string
  itineraries: TripPlanPdfItinerary[]
  filenameBase: string
}
