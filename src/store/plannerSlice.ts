import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  AppliedItinerary,
  ExplorationId,
  LoadPlanPayload,
  PlannerMessage,
  PlannerStoredSession,
  PlannerSuggestion,
  SavedPlannerSession,
  SuggestedItinerary,
} from '@/types/planner'
import { normalizePlanId } from '@/utils/plannerPlanId'
import { DEFAULT_EXPLORATION_ID } from '@/utils/exploration'
import {
  PLANNER_LEGACY_STORAGE_KEY,
  PLANNER_STORAGE_KEY,
  type PlannerAiSource,
  type PlannerState,
} from './planner/types'

export {
  PLANNER_SAVED_SESSIONS_KEY,
  PLANNER_STORAGE_KEY,
  type PlannerAiSource,
  type PlannerState,
} from './planner/types'

type StoredPlannerSession = PlannerStoredSession & { sessionToken?: string; planId?: string | null }

const loadStoredSession = (): Partial<PlannerState> => {
  try {
    const raw =
      localStorage.getItem(PLANNER_STORAGE_KEY) ??
      localStorage.getItem(PLANNER_LEGACY_STORAGE_KEY)
    if (!raw) {
      return {}
    }
    const parsed = JSON.parse(raw) as StoredPlannerSession
    const planId = normalizePlanId(parsed.planId ?? parsed.sessionToken ?? null)

    if (localStorage.getItem(PLANNER_LEGACY_STORAGE_KEY) && !localStorage.getItem(PLANNER_STORAGE_KEY)) {
      localStorage.removeItem(PLANNER_LEGACY_STORAGE_KEY)
    }

    return {
      planId,
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
  activeExplorationId: stored.activeExplorationId ?? DEFAULT_EXPLORATION_ID,
  planId: stored.planId ?? null,
  activePlan: null,
  messages: stored.messages ?? [],
  appliedItineraries: stored.appliedItineraries ?? [],
  dynamicSuggestions: stored.dynamicSuggestions ?? null,
  dynamicItineraries: null,
  aiSource: null,
  isOfflineMode: false,
  isHydrated: false,
}

const persistPlannerSession = (state: PlannerState): void => {
  const hasContent =
    state.messages.length > 0 ||
    state.appliedItineraries.length > 0 ||
    state.dynamicSuggestions !== null

  if (!hasContent && !state.planId) {
    localStorage.removeItem(PLANNER_STORAGE_KEY)
    localStorage.removeItem(PLANNER_LEGACY_STORAGE_KEY)
    return
  }

  const session: PlannerStoredSession = {
    planId: state.planId,
    explorationId: state.activeExplorationId,
    messages: state.messages,
    appliedItineraries: state.appliedItineraries,
    dynamicSuggestions: state.dynamicSuggestions,
  }
  localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(session))
  localStorage.removeItem(PLANNER_LEGACY_STORAGE_KEY)
}

const plannerSlice = createSlice({
  name: 'planner',
  initialState,
  reducers: {
    setHydrated: (state, action: PayloadAction<boolean>) => {
      state.isHydrated = action.payload
    },
    setActiveExploration: (state, action: PayloadAction<ExplorationId>) => {
      const hasLoadedSession =
        state.planId !== null ||
        state.messages.length > 0 ||
        state.dynamicSuggestions !== null ||
        state.dynamicItineraries !== null

      if (state.activeExplorationId === action.payload && !hasLoadedSession) {
        return
      }
      state.activeExplorationId = action.payload
      state.planId = null
      state.activePlan = null
      state.messages = []
      state.dynamicSuggestions = null
      state.dynamicItineraries = null
      state.aiSource = null
      state.isOfflineMode = false
      persistPlannerSession(state)
    },
    setPlanId: (state, action: PayloadAction<string | null>) => {
      state.planId = normalizePlanId(action.payload)
      persistPlannerSession(state)
    },
    setMessages: (state, action: PayloadAction<PlannerMessage[]>) => {
      state.messages = action.payload
      persistPlannerSession(state)
    },
    appendMessages: (state, action: PayloadAction<PlannerMessage[]>) => {
      state.messages.push(...action.payload)
      persistPlannerSession(state)
    },
    applyItinerary: (state, action: PayloadAction<AppliedItinerary>) => {
      const exists = state.appliedItineraries.some((item) => item.id === action.payload.id)
      if (!exists) {
        state.appliedItineraries.push(action.payload)
        persistPlannerSession(state)
      }
    },
    removeAppliedItinerary: (state, action: PayloadAction<string>) => {
      state.appliedItineraries = state.appliedItineraries.filter(
        (item) => item.id !== action.payload,
      )
      persistPlannerSession(state)
    },
    setDynamicSuggestions: (state, action: PayloadAction<PlannerSuggestion[] | null>) => {
      state.dynamicSuggestions = action.payload
      persistPlannerSession(state)
    },
    setDynamicItineraries: (state, action: PayloadAction<SuggestedItinerary[] | null>) => {
      state.dynamicItineraries = action.payload
    },
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.isOfflineMode = action.payload
    },
    setAiSource: (state, action: PayloadAction<PlannerAiSource>) => {
      state.aiSource = action.payload
      state.isOfflineMode = action.payload === 'demo'
    },
    startNewChat: (state) => {
      state.planId = null
      state.activePlan = null
      state.messages = []
      state.appliedItineraries = []
      state.dynamicSuggestions = null
      state.dynamicItineraries = null
      state.aiSource = null
      state.isOfflineMode = false
      localStorage.removeItem(PLANNER_STORAGE_KEY)
      localStorage.removeItem(PLANNER_LEGACY_STORAGE_KEY)
    },
    hydrateFromUrl: (
      state,
      action: PayloadAction<{ explorationId?: ExplorationId; planId?: string }>,
    ) => {
      if (action.payload.explorationId) {
        state.activeExplorationId = action.payload.explorationId
      }
      if (action.payload.planId) {
        state.planId = normalizePlanId(action.payload.planId)
      }
      persistPlannerSession(state)
    },
    restoreSession: (state, action: PayloadAction<SavedPlannerSession>) => {
      const session = action.payload
      state.activeExplorationId = session.explorationId
      state.planId = normalizePlanId(session.id)
      state.activePlan = {
        id: session.id,
        title: session.title,
        explorationId: session.explorationId,
      }
      state.messages = session.messages
      state.appliedItineraries = session.appliedItineraries
      state.dynamicSuggestions = session.dynamicSuggestions
      state.dynamicItineraries = null
      state.aiSource = null
      state.isOfflineMode = false
      persistPlannerSession(state)
    },
    loadPlan: (state, action: PayloadAction<LoadPlanPayload>) => {
      const { planId, explorationId, messages, appliedItineraries, title, imageUrl, duration, travelersCount, type } =
        action.payload
      state.planId = normalizePlanId(planId)
      state.activeExplorationId = explorationId
      state.activePlan = {
        id: planId,
        title,
        imageUrl,
        explorationId,
        duration,
        travelersCount,
        type,
      }
      state.messages = messages
      state.appliedItineraries = appliedItineraries
      state.dynamicSuggestions = null
      state.dynamicItineraries = null
      state.isOfflineMode = false
      persistPlannerSession(state)
    },
  },
})

export const {
  setHydrated,
  setActiveExploration,
  setPlanId,
  setMessages,
  appendMessages,
  applyItinerary,
  removeAppliedItinerary,
  setDynamicSuggestions,
  setDynamicItineraries,
  setOfflineMode,
  setAiSource,
  startNewChat,
  hydrateFromUrl,
  restoreSession,
  loadPlan,
} = plannerSlice.actions

export default plannerSlice.reducer
