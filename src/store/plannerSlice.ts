import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  AppliedItinerary,
  ExplorationId,
  GuestPlannerSession,
  PlannerMessage,
  PlannerSuggestion,
  SuggestedItinerary,
} from '@/types/planner'
import { PLANNER_STORAGE_KEY, type PlannerState } from './planner/types'

export { PLANNER_STORAGE_KEY, type PlannerState } from './planner/types'

const loadStoredSession = (): Partial<PlannerState> => {
  try {
    const raw = localStorage.getItem(PLANNER_STORAGE_KEY)
    if (!raw) {
      return {}
    }
    const parsed = JSON.parse(raw) as GuestPlannerSession
    return {
      sessionToken: parsed.sessionToken,
      activeExplorationId: parsed.explorationId,
      messages: parsed.messages,
      appliedItineraries: parsed.appliedItineraries,
      dynamicSuggestions: parsed.dynamicSuggestions,
    }
  } catch {
    return {}
  }
}

const stored = loadStoredSession()

const initialState: PlannerState = {
  activeExplorationId: stored.activeExplorationId ?? 'iceland',
  sessionToken: stored.sessionToken ?? null,
  messages: stored.messages ?? [],
  appliedItineraries: stored.appliedItineraries ?? [],
  dynamicSuggestions: stored.dynamicSuggestions ?? null,
  dynamicItineraries: null,
  isOfflineMode: false,
  isHydrated: false,
}

const persistGuestSession = (state: PlannerState): void => {
  const session: GuestPlannerSession = {
    sessionToken: state.sessionToken ?? `guest_${Date.now()}`,
    explorationId: state.activeExplorationId,
    messages: state.messages,
    appliedItineraries: state.appliedItineraries,
    dynamicSuggestions: state.dynamicSuggestions,
  }
  localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(session))
}

const plannerSlice = createSlice({
  name: 'planner',
  initialState,
  reducers: {
    setHydrated: (state, action: PayloadAction<boolean>) => {
      state.isHydrated = action.payload
    },
    setActiveExploration: (state, action: PayloadAction<ExplorationId>) => {
      if (state.activeExplorationId === action.payload) {
        return
      }
      state.activeExplorationId = action.payload
      state.messages = []
      state.dynamicSuggestions = null
      state.dynamicItineraries = null
      state.isOfflineMode = false
      persistGuestSession(state)
    },
    setSessionToken: (state, action: PayloadAction<string | null>) => {
      state.sessionToken = action.payload
      persistGuestSession(state)
    },
    setMessages: (state, action: PayloadAction<PlannerMessage[]>) => {
      state.messages = action.payload
      persistGuestSession(state)
    },
    appendMessages: (state, action: PayloadAction<PlannerMessage[]>) => {
      state.messages.push(...action.payload)
      persistGuestSession(state)
    },
    applyItinerary: (state, action: PayloadAction<AppliedItinerary>) => {
      const exists = state.appliedItineraries.some((item) => item.id === action.payload.id)
      if (!exists) {
        state.appliedItineraries.push(action.payload)
        persistGuestSession(state)
      }
    },
    removeAppliedItinerary: (state, action: PayloadAction<string>) => {
      state.appliedItineraries = state.appliedItineraries.filter(
        (item) => item.id !== action.payload,
      )
      persistGuestSession(state)
    },
    setDynamicSuggestions: (state, action: PayloadAction<PlannerSuggestion[] | null>) => {
      state.dynamicSuggestions = action.payload
      persistGuestSession(state)
    },
    setDynamicItineraries: (state, action: PayloadAction<SuggestedItinerary[] | null>) => {
      state.dynamicItineraries = action.payload
    },
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.isOfflineMode = action.payload
    },
    startNewChat: (state) => {
      state.sessionToken = null
      state.messages = []
      state.appliedItineraries = []
      state.dynamicSuggestions = null
      state.dynamicItineraries = null
      localStorage.removeItem(PLANNER_STORAGE_KEY)
    },
    hydrateFromUrl: (
      state,
      action: PayloadAction<{ explorationId?: ExplorationId; sessionToken?: string }>,
    ) => {
      if (action.payload.explorationId) {
        state.activeExplorationId = action.payload.explorationId
      }
      if (action.payload.sessionToken) {
        state.sessionToken = action.payload.sessionToken
      }
      persistGuestSession(state)
    },
  },
})

export const {
  setHydrated,
  setActiveExploration,
  setSessionToken,
  setMessages,
  appendMessages,
  applyItinerary,
  removeAppliedItinerary,
  setDynamicSuggestions,
  setDynamicItineraries,
  setOfflineMode,
  startNewChat,
  hydrateFromUrl,
} = plannerSlice.actions

export default plannerSlice.reducer
