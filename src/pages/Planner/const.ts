import type { PlannerExploration, SuggestedItinerary } from './types'

export const PLANNER_I18N = {
  title: 'pages.planner.title',
  comingSoon: 'pages.planner.comingSoon',
  newChat: 'pages.planner.newChat',
  recentExplorations: 'pages.planner.recentExplorations',
  trip: {
    eyebrow: 'pages.planner.trip.eyebrow',
    title: 'pages.planner.trip.title',
    dates: 'pages.planner.trip.dates',
    travelers: 'pages.planner.trip.travelers',
    share: 'pages.planner.trip.share',
    exportPdf: 'pages.planner.trip.exportPdf',
  },
  ai: {
    label: 'pages.planner.ai.label',
    title: 'pages.planner.ai.title',
    description: 'pages.planner.ai.description',
    generate: 'pages.planner.ai.generate',
  },
  itineraries: {
    title: 'pages.planner.itineraries.title',
    subtitle: 'pages.planner.itineraries.subtitle',
    viewAll: 'pages.planner.itineraries.viewAll',
    usePlan: 'pages.planner.itineraries.usePlan',
    categories: {
      nature: 'pages.planner.itineraries.categories.nature',
      wellness: 'pages.planner.itineraries.categories.wellness',
      adventure: 'pages.planner.itineraries.categories.adventure',
    },
  },
} as const

export const TRIP_HERO_IMAGE =
  'https://images.unsplash.com/photo-1504893521153-965663756c02?auto=format&fit=crop&w=1400&q=80'

export const RECENT_EXPLORATIONS: PlannerExploration[] = [
  {
    id: 'iceland',
    titleKey: 'pages.planner.explorations.iceland.title',
    metaKey: 'pages.planner.explorations.iceland.meta',
  },
  {
    id: 'tuscany',
    titleKey: 'pages.planner.explorations.tuscany.title',
    metaKey: 'pages.planner.explorations.tuscany.meta',
  },
  {
    id: 'kyoto',
    titleKey: 'pages.planner.explorations.kyoto.title',
    metaKey: 'pages.planner.explorations.kyoto.meta',
  },
  {
    id: 'amalfi',
    titleKey: 'pages.planner.explorations.amalfi.title',
    metaKey: 'pages.planner.explorations.amalfi.meta',
  },
]

export const SUGGESTED_ITINERARIES: SuggestedItinerary[] = [
  {
    id: 'seljalandsfoss',
    titleKey: 'pages.planner.itineraries.items.waterfall.title',
    descriptionKey: 'pages.planner.itineraries.items.waterfall.description',
    imageUrl:
      'https://images.unsplash.com/photo-1529963183137-3323fab7c7fb?auto=format&fit=crop&w=600&q=80',
    category: 'nature',
    durationKey: 'pages.planner.itineraries.items.waterfall.duration',
  },
  {
    id: 'blue-lagoon',
    titleKey: 'pages.planner.itineraries.items.lagoon.title',
    descriptionKey: 'pages.planner.itineraries.items.lagoon.description',
    imageUrl:
      'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=600&q=80',
    category: 'wellness',
    durationKey: 'pages.planner.itineraries.items.lagoon.duration',
  },
  {
    id: 'ice-cave',
    titleKey: 'pages.planner.itineraries.items.iceCave.title',
    descriptionKey: 'pages.planner.itineraries.items.iceCave.description',
    imageUrl:
      'https://images.unsplash.com/photo-1531168556467-80aace0d48f1?auto=format&fit=crop&w=600&q=80',
    category: 'adventure',
    durationKey: 'pages.planner.itineraries.items.iceCave.duration',
  },
]

export const ACTIVE_EXPLORATION_ID = 'iceland'

export const CATEGORY_I18N_KEYS = {
  nature: PLANNER_I18N.itineraries.categories.nature,
  wellness: PLANNER_I18N.itineraries.categories.wellness,
  adventure: PLANNER_I18N.itineraries.categories.adventure,
} as const
