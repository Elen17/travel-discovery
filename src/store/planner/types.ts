import type {
  AppliedItinerary,
  ExplorationId,
  PlannerMessage,
  PlannerSuggestion,
  SuggestedItinerary,
} from '@/types/planner'

export const PLANNER_STORAGE_KEY = 'planner_guest_session'
export const PLANNER_SAVED_SESSIONS_KEY = 'planner_saved_sessions'

export type PlannerAiSource = 'gemini' | 'backend' | 'demo' | null

export type PlannerState = {
  activeExplorationId: ExplorationId
  sessionToken: string | null
  messages: PlannerMessage[]
  appliedItineraries: AppliedItinerary[]
  dynamicSuggestions: PlannerSuggestion[] | null
  dynamicItineraries: SuggestedItinerary[] | null
  aiSource: PlannerAiSource
  isOfflineMode: boolean
  isHydrated: boolean
}
