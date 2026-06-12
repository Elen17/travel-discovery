import type {
  PlannerChatPayload,
  PlannerChatResponse,
  PlannerMessage,
  PlannerPlan,
  PlannerPlanPayload,
  PlannerSuggestion,
} from '@/types/planner'
import { DEFAULT_EXPLORATION_ID } from '@/utils/exploration'

const MOCK_PLAN_PREFIX = 'mock_plan_'

const generatePlanId = (): string =>
  `${MOCK_PLAN_PREFIX}${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

const planStore = new Map<string, PlannerMessage[]>()

const ICELAND_INSIGHTS: PlannerSuggestion[] = [
  {
    id: 'seljalandsfoss',
    title: 'Seljalandsfoss & Gljúfrabúi',
    category: 'nature',
    duration: '6 Hours',
    description:
      'Walk behind cascading waterfalls and explore hidden canyon grottos along the south coast.',
    steps: [
      'Drive from Vik to Seljalandsfoss (30 min)',
      'Walk the path behind the waterfall',
      'Explore Gljúfrabúi hidden gorge',
      'Return via Route 1 with photo stops',
    ],
  },
  {
    id: 'blue-lagoon',
    title: 'Blue Lagoon Retreat',
    category: 'wellness',
    duration: '4 Hours',
    description:
      'Unwind in geothermal waters surrounded by volcanic landscapes and premium spa rituals.',
    steps: [
      'Book timed entry slot in advance',
      'Silica mud mask and lagoon swim',
      'Lava restaurant lunch overlooking the lagoon',
    ],
  },
  {
    id: 'ice-cave',
    title: 'Crystal Ice Cave Tour',
    category: 'adventure',
    duration: '5 Hours',
    description:
      'Venture inside a natural glacier cave with expert guides and dramatic blue ice formations.',
    steps: [
      'Meet guide at Jökulsárlón parking',
      'Super jeep transfer to glacier edge',
      'Guided ice cave walk with safety gear',
    ],
  },
]

const TUSCANY_INSIGHTS: PlannerSuggestion[] = [
  {
    id: 'chianti-vineyards',
    title: 'Chianti Wine Route',
    category: 'nature',
    duration: '7 Hours',
    description: 'Rolling hills, medieval villages, and cellar tastings across Chianti Classico.',
    steps: [
      'Morning departure from Florence',
      'Greve in Chianti town square stroll',
      'Two winery visits with guided tastings',
      'Sunset dinner at agriturismo',
    ],
  },
  {
    id: 'spa-terme',
    title: 'Tuscan Thermal Springs',
    category: 'wellness',
    duration: '5 Hours',
    description: 'Historic thermal baths in Saturnia with natural cascading pools.',
    steps: [
      'Drive to Saturnia hot springs',
      'Relax in natural limestone pools',
      'Light Tuscan lunch at local trattoria',
    ],
  },
  {
    id: 'cycling-hills',
    title: 'Hilltop Village Cycling',
    category: 'adventure',
    duration: '6 Hours',
    description: 'E-bike tour through cypress-lined roads linking San Gimignano and Volterra.',
    steps: [
      'E-bike fitting and safety briefing',
      'Guided ride through vineyard lanes',
      'Gelato stop in San Gimignano',
    ],
  },
]

const KYOTO_INSIGHTS: PlannerSuggestion[] = [
  {
    id: 'fushimi-trail',
    title: 'Fushimi Inari & Bamboo Grove',
    category: 'nature',
    duration: '6 Hours',
    description: 'Iconic torii gates and serene bamboo paths in eastern Kyoto.',
    steps: [
      'Early visit to Fushimi Inari shrine',
      'Hike through vermillion gate tunnels',
      'Arashiyama bamboo grove walk',
    ],
  },
  {
    id: 'onsen-retreat',
    title: 'Traditional Onsen Retreat',
    category: 'wellness',
    duration: '4 Hours',
    description: 'Authentic ryokan soak and kaiseki-inspired wellness rituals.',
    steps: [
      'Check in at partner ryokan',
      'Outdoor onsen soak session',
      'Matcha and wagashi tea service',
    ],
  },
  {
    id: 'night-walk',
    title: 'Gion Evening Heritage Walk',
    category: 'adventure',
    duration: '5 Hours',
    description: 'Guided evening walk through Gion with temple illuminations.',
    steps: [
      'Meet guide at Yasaka Shrine',
      'Lantern-lit stroll through Gion',
      'Hidden alleyways and tea house stories',
    ],
  },
]

const AMALFI_INSIGHTS: PlannerSuggestion[] = [
  {
    id: 'coastal-path',
    title: 'Path of the Gods Hike',
    category: 'nature',
    duration: '6 Hours',
    description: 'Clifftop trail with sweeping views of the Tyrrhenian Sea.',
    steps: [
      'Bus to Bomerano starting point',
      'Hike Sentiero degli Dei',
      'Limoncello stop in Positano',
    ],
  },
  {
    id: 'boat-cruise',
    title: 'Amalfi Coast Boat Day',
    category: 'wellness',
    duration: '5 Hours',
    description: 'Private boat cruise with swimming coves and coastal relaxation.',
    steps: [
      'Depart from Amalfi harbor',
      'Swim stops at hidden coves',
      'Aperitivo on deck at sunset',
    ],
  },
  {
    id: 'ravello-concert',
    title: 'Ravello Villa Gardens',
    category: 'adventure',
    duration: '4 Hours',
    description: 'Explore Villa Rufolo gardens and clifftop concert terraces.',
    steps: [
      'Scenic drive to Ravello',
      'Villa Rufolo garden tour',
      'Terrace views over the coastline',
    ],
  },
]

const INSIGHTS_BY_EXPLORATION: Record<string, PlannerSuggestion[]> = {
  iceland: ICELAND_INSIGHTS,
  tuscany: TUSCANY_INSIGHTS,
  kyoto: KYOTO_INSIGHTS,
  amalfi: AMALFI_INSIGHTS,
}

const REPLY_TEMPLATES: Record<string, string> = {
  iceland:
    "Based on your preferences and today's weather near Vik, I've curated three experiences along Iceland's south coast — from waterfall walks to glacier caves.",
  tuscany:
    "I've mapped a perfect Tuscan day blending vineyard tastings, thermal wellness, and hilltop cycling through Chianti country.",
  kyoto:
    'For your Kyoto stay, here are three refined experiences balancing temple trails, onsen wellness, and Gion heritage walks.',
  amalfi:
    "Along the Amalfi Coast, I've selected cliffside hikes, boat days, and Ravello garden visits tailored to your coastal expedition.",
}

const getExplorationFromMessage = (message: string, fallback = DEFAULT_EXPLORATION_ID): string => {
  const lower = message.toLowerCase()
  if (lower.includes('tuscany') || lower.includes('chianti') || lower.includes('florence')) {
    return 'tuscany'
  }
  if (lower.includes('kyoto') || lower.includes('japan') || lower.includes('temple')) {
    return 'kyoto'
  }
  if (lower.includes('amalfi') || lower.includes('positano') || lower.includes('coast')) {
    return 'amalfi'
  }
  if (lower.includes('iceland') || lower.includes('vik') || lower.includes('ring road')) {
    return 'iceland'
  }
  return fallback
}

export const mockSendPlannerMessage = async (
  payload: PlannerChatPayload,
): Promise<PlannerChatResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const explorationId =
    payload.explorationId ??
    getExplorationFromMessage(payload.message, DEFAULT_EXPLORATION_ID)
  const planId = payload.planId ?? generatePlanId()
  const lowerMessage = payload.message.toLowerCase()
  const isGenerateInsights =
    lowerMessage.includes('generate insights') ||
    lowerMessage.includes('suggest') ||
    lowerMessage.includes('itinerar') ||
    lowerMessage.includes('day plan')

  const existing = planStore.get(planId) ?? []
  const userMessage: PlannerMessage = { role: 'user', content: payload.message }
  const reply = isGenerateInsights
    ? (REPLY_TEMPLATES[explorationId] ??
      `I've curated experiences for your ${explorationId} trip based on your preferences.`)
    : `I'd love to help you plan your ${explorationId} adventure. Tell me more about your interests, pace, and must-see spots — or tap "Generate Insights" for curated day plans.`

  const assistantMessage: PlannerMessage = { role: 'assistant', content: reply }
  const updated = [...existing, userMessage, assistantMessage]
  planStore.set(planId, updated)

  return {
    reply,
    planId,
    suggestions: isGenerateInsights
      ? (INSIGHTS_BY_EXPLORATION[explorationId] ?? INSIGHTS_BY_EXPLORATION[DEFAULT_EXPLORATION_ID])
      : undefined,
  }
}

export const mockGetPlannerHistory = async (planId: string): Promise<PlannerMessage[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return planStore.get(planId) ?? []
}

export const getMockInsightsForExploration = (explorationId: string): PlannerSuggestion[] =>
  INSIGHTS_BY_EXPLORATION[explorationId] ?? INSIGHTS_BY_EXPLORATION[DEFAULT_EXPLORATION_ID] ?? []

export const mockGetPlannerPlans = async (): Promise<PlannerPlan[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return []
}

export const mockCreatePlannerPlan = async (payload: PlannerPlanPayload): Promise<PlannerPlan> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const now = new Date().toISOString()

  return {
    id: `mock_plan_${Date.now()}`,
    title: payload.title ?? 'Untitled plan',
    description: payload.description,
    explorationId: payload.explorationId ?? DEFAULT_EXPLORATION_ID,
    duration: payload.duration,
    type: payload.type,
    travelersCount: payload.travelersCount,
    imageUrl: payload.imageUrl,
    createdAt: now,
    updatedAt: now,
    messages: payload.messages ?? [],
    appliedItineraries: (payload.appliedItineraries ?? []).map((item, index) => ({
      id: index + 1,
      title: item.title,
      description: item.description,
    })),
  }
}
