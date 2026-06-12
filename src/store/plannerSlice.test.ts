import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AppliedItinerary } from '@/types/planner'
import { PLANNER_STORAGE_KEY } from '@/store/planner/types'

const appliedItinerary: AppliedItinerary = {
  id: 'waterfall',
  titleKey: '',
  title: 'Waterfall Hike',
  durationKey: '',
  category: 'nature',
  appliedAt: '2026-06-01T10:00:00.000Z',
}

const loadPlannerModule = async () => {
  vi.resetModules()
  return import('./plannerSlice')
}

describe('plannerSlice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with default exploration and empty session state', async () => {
    const { default: plannerReducer } = await loadPlannerModule()
    const state = plannerReducer(undefined, { type: 'init' })

    expect(state.activeExplorationId).toBe('iceland')
    expect(state.planId).toBeNull()
    expect(state.messages).toEqual([])
    expect(state.appliedItineraries).toEqual([])
  })

  it('applies an itinerary only once', async () => {
    const { default: plannerReducer, applyItinerary } = await loadPlannerModule()
    let state = plannerReducer(undefined, { type: 'init' })

    state = plannerReducer(state, applyItinerary(appliedItinerary))
    state = plannerReducer(state, applyItinerary(appliedItinerary))

    expect(state.appliedItineraries).toHaveLength(1)
    expect(state.appliedItineraries[0]?.id).toBe('waterfall')
  })

  it('removes applied itineraries by id', async () => {
    const { default: plannerReducer, applyItinerary, removeAppliedItinerary } =
      await loadPlannerModule()
    let state = plannerReducer(undefined, applyItinerary(appliedItinerary))

    state = plannerReducer(state, removeAppliedItinerary('waterfall'))

    expect(state.appliedItineraries).toEqual([])
  })

  it('clears session state when starting a new chat', async () => {
    const { default: plannerReducer, applyItinerary, setMessages, startNewChat } =
      await loadPlannerModule()
    let state = plannerReducer(undefined, { type: 'init' })
    state = plannerReducer(state, setMessages([{ role: 'user', content: 'Hello' }]))
    state = plannerReducer(state, applyItinerary(appliedItinerary))
    localStorage.setItem(PLANNER_STORAGE_KEY, '{"planId":"plan-1"}')

    state = plannerReducer(state, startNewChat())

    expect(state.messages).toEqual([])
    expect(state.appliedItineraries).toEqual([])
    expect(state.planId).toBeNull()
    expect(localStorage.getItem(PLANNER_STORAGE_KEY)).toBeNull()
  })

  it('ignores local-only plan ids when setting plan id', async () => {
    const { default: plannerReducer, setPlanId } = await loadPlannerModule()
    const state = plannerReducer(undefined, setPlanId('guest_temp_1'))

    expect(state.planId).toBeNull()
  })

  it('hydrates exploration and plan id from url params', async () => {
    const { default: plannerReducer, hydrateFromUrl } = await loadPlannerModule()
    const state = plannerReducer(
      undefined,
      hydrateFromUrl({ explorationId: 'kyoto', planId: 'plan-42' }),
    )

    expect(state.activeExplorationId).toBe('kyoto')
    expect(state.planId).toBe('plan-42')
  })
})
