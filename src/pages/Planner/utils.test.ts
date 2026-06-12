import { describe, expect, it } from 'vitest'
import { EXPLORATION_CONTENT } from './const'
import {
  apiAppliedToUi,
  buildGenerateInsightsPrompt,
  buildHotelContextPrompt,
  buildPlannerPlanPayload,
  buildPlannerUrl,
  buildShareUrl,
  getExplorationContent,
  parsePlannerSearchParams,
  plannerPlanToLoadPayload,
  plannerPlanToSavedSession,
  resolveExplorationFromDestination,
  resolveExplorationFromParams,
  suggestionsToItineraries,
  uiAppliedToApi,
} from './utils'
import type { AppliedItinerary, PlannerPlan } from '@/types/planner'

describe('Planner utils', () => {
  describe('resolveExplorationFromDestination', () => {
    it('maps known destinations and aliases', () => {
      expect(resolveExplorationFromDestination('Iceland')).toBe('iceland')
      expect(resolveExplorationFromDestination('Italy')).toBe('amalfi')
      expect(resolveExplorationFromDestination('Japan')).toBe('kyoto')
    })

    it('returns undefined for unknown destinations', () => {
      expect(resolveExplorationFromDestination('Paris')).toBeUndefined()
      expect(resolveExplorationFromDestination(undefined)).toBeUndefined()
    })
  })

  describe('parsePlannerSearchParams', () => {
    it('extracts planner query params from the url', () => {
      const params = new URLSearchParams(
        'exploration=kyoto&destination=Kyoto&hotelId=42&hotelName=Ryokan&dates=2026-07-01&guests=2&session=plan-1',
      )

      expect(parsePlannerSearchParams(params)).toEqual({
        exploration: 'kyoto',
        destination: 'Kyoto',
        hotelId: '42',
        hotelName: 'Ryokan',
        dates: '2026-07-01',
        guests: '2',
        session: 'plan-1',
      })
    })
  })

  describe('resolveExplorationFromParams', () => {
    it('prefers explicit exploration over destination mapping', () => {
      expect(
        resolveExplorationFromParams({
          exploration: 'tuscany',
          destination: 'Iceland',
        }),
      ).toBe('tuscany')
    })

    it('falls back to destination mapping', () => {
      expect(resolveExplorationFromParams({ destination: 'Reykjavik' })).toBeUndefined()
      expect(resolveExplorationFromParams({ destination: 'Iceland' })).toBe('iceland')
    })
  })

  describe('buildPlannerUrl', () => {
    it('builds a query string for populated params', () => {
      expect(
        buildPlannerUrl({
          exploration: 'iceland',
          destination: 'Reykjavik',
        }),
      ).toBe('/planner?exploration=iceland&destination=Reykjavik')
    })

    it('returns the base planner route when params are empty', () => {
      expect(buildPlannerUrl({})).toBe('/planner')
    })
  })

  describe('buildShareUrl', () => {
    it('builds a shareable planner url with encoded session id', () => {
      expect(buildShareUrl('plan 1', 'iceland')).toBe(
        `${window.location.origin}/planner?session=plan%201&exploration=iceland`,
      )
    })
  })

  describe('getExplorationContent', () => {
    it('returns the requested exploration content', () => {
      expect(getExplorationContent('kyoto', EXPLORATION_CONTENT).id).toBe('kyoto')
    })

    it('falls back to the default exploration content', () => {
      expect(getExplorationContent('unknown', EXPLORATION_CONTENT).id).toBe('iceland')
    })
  })

  describe('suggestionsToItineraries', () => {
    it('maps api suggestions into ui itineraries', () => {
      const result = suggestionsToItineraries(
        [
          {
            id: 'blue-lagoon',
            title: 'Blue Lagoon',
            category: 'wellness',
            duration: 'Half day',
            description: 'Relax in geothermal waters',
          },
        ],
        'iceland',
      )

      expect(result[0]).toMatchObject({
        id: 'blue-lagoon',
        title: 'Blue Lagoon',
        category: 'wellness',
        duration: 'Half day',
        titleKey: 'pages.planner.explorations.iceland.dynamic.blue-lagoon.title',
      })
      expect(result[0]?.imageUrl).toContain('http')
    })
  })

  describe('applied itinerary mappers', () => {
    const appliedItem: AppliedItinerary = {
      id: 'seljalandsfoss',
      titleKey: '',
      title: 'Seljalandsfoss',
      description: 'Waterfall visit',
      durationKey: '',
      duration: '4 Hours',
      category: 'nature',
      appliedAt: '2026-06-01T10:00:00.000Z',
    }

    it('maps api applied items to ui shape', () => {
      const uiItem = apiAppliedToUi({
        id: 7,
        title: 'Seljalandsfoss',
        description: 'Waterfall visit',
      })

      expect(uiItem).toMatchObject({
        id: '7',
        title: 'Seljalandsfoss',
        description: 'Waterfall visit',
        category: 'nature',
      })
      expect(uiItem.appliedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })

    it('maps ui applied items to api payload shape', () => {
      expect(uiAppliedToApi(appliedItem)).toEqual({
        title: 'Seljalandsfoss',
        description: 'Waterfall visit',
      })
    })
  })

  describe('buildPlannerPlanPayload', () => {
    it('builds a save payload from planner state', () => {
      const exploration = EXPLORATION_CONTENT.iceland
      const payload = buildPlannerPlanPayload(
        'Iceland Trip',
        'iceland',
        [{ role: 'user', content: 'Plan my trip' }],
        [
          {
            id: 'lagoon',
            titleKey: '',
            title: 'Blue Lagoon',
            durationKey: '',
            category: 'wellness',
            appliedAt: '2026-06-01T10:00:00.000Z',
          },
        ],
        exploration,
      )

      expect(payload).toEqual({
        title: 'Iceland Trip',
        explorationId: 'iceland',
        imageUrl: exploration.heroImage,
        messages: [{ role: 'user', content: 'Plan my trip' }],
        appliedItineraries: [{ title: 'Blue Lagoon', description: undefined }],
      })
    })
  })

  describe('planner plan conversions', () => {
    const plan: PlannerPlan = {
      id: 'plan-123',
      title: 'Kyoto Escape',
      explorationId: 'kyoto',
      imageUrl: 'https://example.com/kyoto.jpg',
      messages: [{ role: 'assistant', content: 'Welcome' }],
      appliedItineraries: [{ id: 1, title: 'Temple Walk', description: 'Morning tour' }],
      createdAt: '2026-06-01T10:00:00.000Z',
      updatedAt: '2026-06-02T10:00:00.000Z',
      duration: 5,
      travelersCount: 2,
      type: 'leisure',
    }

    it('converts a saved plan into a load payload', () => {
      const payload = plannerPlanToLoadPayload(plan)

      expect(payload).toMatchObject({
        planId: 'plan-123',
        explorationId: 'kyoto',
        title: 'Kyoto Escape',
        duration: 5,
        travelersCount: 2,
        type: 'leisure',
      })
      expect(payload.appliedItineraries[0]?.title).toBe('Temple Walk')
    })

    it('converts a saved plan into a sidebar session', () => {
      const session = plannerPlanToSavedSession(plan)

      expect(session).toMatchObject({
        id: 'plan-123',
        title: 'Kyoto Escape',
        explorationId: 'kyoto',
        dynamicSuggestions: null,
        savedAt: plan.createdAt,
        updatedAt: plan.updatedAt,
      })
    })
  })

  describe('prompt builders', () => {
    it('builds insight and hotel context prompts', () => {
      expect(buildGenerateInsightsPrompt('tuscany')).toContain('tuscany')
      expect(buildHotelContextPrompt('Grand Hotel', 'Florence')).toContain('Grand Hotel')
      expect(buildHotelContextPrompt('Grand Hotel', 'Florence')).toContain('Florence')
    })
  })
})
