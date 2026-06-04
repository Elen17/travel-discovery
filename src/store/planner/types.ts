import type {
  AppliedItinerary,
  ExplorationId,
  PlannerMessage,
  PlannerSuggestion,
  SuggestedItinerary,
} from '@/types/planner'

export const PLANNER_STORAGE_KEY = 'planner_guest_session'

export type PlannerState = {
  activeExplorationId: ExplorationId
  sessionToken: string | null
  messages: PlannerMessage[]
  appliedItineraries: AppliedItinerary[]
  dynamicSuggestions: PlannerSuggestion[] | null
  dynamicItineraries: SuggestedItinerary[] | null
  isOfflineMode: boolean
  isHydrated: boolean
}
