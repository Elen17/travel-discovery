import type { ExplorationContent, ExplorationId, PlannerExploration } from '@/types/planner'

export const PLANNER_I18N = {
  title: 'pages.planner.title',
  comingSoon: 'pages.planner.comingSoon',
  newChat: 'pages.planner.newChat',
  dailyPlans: 'pages.planner.dailyPlans',
  dailyPlansEmpty: 'pages.planner.dailyPlansEmpty',
  recentExplorations: 'pages.planner.recentExplorations',
  trip: {
    eyebrow: 'pages.planner.trip.eyebrow',
    title: 'pages.planner.trip.title',
    dates: 'pages.planner.trip.dates',
    travelers: 'pages.planner.trip.travelers',
    share: 'pages.planner.trip.share',
    exportPdf: 'pages.planner.trip.exportPdf',
    planDurationDays: 'pages.planner.trip.planDurationDays',
    planDurationHours: 'pages.planner.trip.planDurationHours',
    planTravelersCount: 'pages.planner.trip.planTravelersCount',
  },
  ai: {
    label: 'pages.planner.ai.label',
    title: 'pages.planner.ai.title',
    description: 'pages.planner.ai.description',
    generate: 'pages.planner.ai.generate',
    generating: 'pages.planner.ai.generating',
    sourceGemini: 'pages.planner.ai.sourceGemini',
    sourceDemo: 'pages.planner.ai.sourceDemo',
  },
  itineraries: {
    title: 'pages.planner.itineraries.title',
    subtitle: 'pages.planner.itineraries.subtitle',
    viewAll: 'pages.planner.itineraries.viewAll',
    usePlan: 'pages.planner.itineraries.usePlan',
    viewDetails: 'pages.planner.itineraries.viewDetails',
    categories: {
      nature: 'pages.planner.itineraries.categories.nature',
      wellness: 'pages.planner.itineraries.categories.wellness',
      adventure: 'pages.planner.itineraries.categories.adventure',
    },
  },
  chat: {
    placeholder: 'pages.planner.chat.placeholder',
    send: 'pages.planner.chat.send',
    empty: 'pages.planner.chat.empty',
    emptyHint: 'pages.planner.chat.emptyHint',
    offline: 'pages.planner.chat.offline',
    typing: 'pages.planner.chat.typing',
    loginPrompt: 'pages.planner.chat.loginPrompt',
    history: 'pages.planner.chat.history',
    historyTitle: 'pages.planner.chat.historyTitle',
    historyEmpty: 'pages.planner.chat.historyEmpty',
    historyRestore: 'pages.planner.chat.historyRestore',
    historyDelete: 'pages.planner.chat.historyDelete',
    historyMessages: 'pages.planner.chat.historyMessages',
    historyPlans: 'pages.planner.chat.historyPlans',
    save: 'pages.planner.chat.save',
    saveSuccess: 'pages.planner.chat.saveSuccess',
    saveEmptyHint: 'pages.planner.chat.saveEmptyHint',
    saveModalTitle: 'pages.planner.chat.saveModalTitle',
    saveModalLabel: 'pages.planner.chat.saveModalLabel',
    saveModalConfirm: 'pages.planner.chat.saveModalConfirm',
    saveModalCancel: 'pages.planner.chat.saveModalCancel',
    sourceGemini: 'pages.planner.chat.sourceGemini',
    sourceBackend: 'pages.planner.chat.sourceBackend',
    sourceDemo: 'pages.planner.chat.sourceDemo',
    errorGeneric: 'pages.planner.chat.errorGeneric',
  },
  applied: {
    title: 'pages.planner.applied.title',
    empty: 'pages.planner.applied.empty',
    added: 'pages.planner.applied.added',
    remove: 'pages.planner.applied.remove',
  },
  share: {
    copied: 'pages.planner.share.copied',
    failed: 'pages.planner.share.failed',
  },
  drawer: {
    title: 'pages.planner.drawer.title',
    steps: 'pages.planner.drawer.steps',
    close: 'pages.planner.drawer.close',
  },
  print: {
    title: 'pages.planner.print.title',
  },
} as const

export const CATEGORY_I18N_KEYS = {
  nature: PLANNER_I18N.itineraries.categories.nature,
  wellness: PLANNER_I18N.itineraries.categories.wellness,
  adventure: PLANNER_I18N.itineraries.categories.adventure,
} as const

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

export const EXPLORATION_CONTENT: Record<string, ExplorationContent> = {
  iceland: {
    id: 'iceland',
    heroImage:
      'https://api.travalot.com/attachment/9dc9f840-5b17-11f0-a193-ad9eff9dce55.jpg',
    trip: {
      eyebrowKey: 'pages.planner.explorations.iceland.trip.eyebrow',
      titleKey: 'pages.planner.explorations.iceland.trip.title',
      datesKey: 'pages.planner.explorations.iceland.trip.dates',
      travelersKey: 'pages.planner.explorations.iceland.trip.travelers',
    },
    suggestedItineraries: [
      {
        id: 'seljalandsfoss',
        titleKey: 'pages.planner.explorations.iceland.itineraries.waterfall.title',
        descriptionKey: 'pages.planner.explorations.iceland.itineraries.waterfall.description',
        imageUrl:
          'https://www.motorhomeiceland.com/assets/img/blog/seljalandsfoss-waterfall-discovering-southern-icelands-beauty.webp',
        category: 'nature',
        durationKey: 'pages.planner.explorations.iceland.itineraries.waterfall.duration',
        stepKeys: [
          'pages.planner.explorations.iceland.itineraries.waterfall.steps.0',
          'pages.planner.explorations.iceland.itineraries.waterfall.steps.1',
          'pages.planner.explorations.iceland.itineraries.waterfall.steps.2',
        ],
      },
      {
        id: 'blue-lagoon',
        titleKey: 'pages.planner.explorations.iceland.itineraries.lagoon.title',
        descriptionKey: 'pages.planner.explorations.iceland.itineraries.lagoon.description',
        imageUrl:
          'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=600&q=80',
        category: 'wellness',
        durationKey: 'pages.planner.explorations.iceland.itineraries.lagoon.duration',
        stepKeys: [
          'pages.planner.explorations.iceland.itineraries.lagoon.steps.0',
          'pages.planner.explorations.iceland.itineraries.lagoon.steps.1',
        ],
      },
      {
        id: 'ice-cave',
        titleKey: 'pages.planner.explorations.iceland.itineraries.iceCave.title',
        descriptionKey: 'pages.planner.explorations.iceland.itineraries.iceCave.description',
        imageUrl:
          'https://gti.images.tshiftcdn.com/7955524/x/0/a-person-explores-the-stunning-blue-ice-cave-beneath-vatnajokull-glacier-in-iceland-during-winter.jpg?dpr=2&height=360&quality=65',
        category: 'adventure',
        durationKey: 'pages.planner.explorations.iceland.itineraries.iceCave.duration',
        stepKeys: [
          'pages.planner.explorations.iceland.itineraries.iceCave.steps.0',
          'pages.planner.explorations.iceland.itineraries.iceCave.steps.1',
        ],
      },
    ],
  },
  tuscany: {
    id: 'tuscany',
    heroImage:
      'https://media.istockphoto.com/id/938325926/photo/downtown-siena-skyline-in-italy.jpg?s=612x612&w=0&k=20&c=Lj-py0qNKy4HIs3ulnZgCIkFYMRH0hGvTPAyqgcPE2c=',
    trip: {
      eyebrowKey: 'pages.planner.explorations.tuscany.trip.eyebrow',
      titleKey: 'pages.planner.explorations.tuscany.trip.title',
      datesKey: 'pages.planner.explorations.tuscany.trip.dates',
      travelersKey: 'pages.planner.explorations.tuscany.trip.travelers',
    },
    suggestedItineraries: [
      {
        id: 'chianti-vineyards',
        titleKey: 'pages.planner.explorations.tuscany.itineraries.chianti.title',
        descriptionKey: 'pages.planner.explorations.tuscany.itineraries.chianti.description',
        imageUrl:
          'https://media.tacdn.com/media/attractions-splice-spp-674x446/09/ab/44/0b.jpg',
        category: 'nature',
        durationKey: 'pages.planner.explorations.tuscany.itineraries.chianti.duration',
        stepKeys: [
          'pages.planner.explorations.tuscany.itineraries.chianti.steps.0',
          'pages.planner.explorations.tuscany.itineraries.chianti.steps.1',
        ],
      },
      {
        id: 'spa-terme',
        titleKey: 'pages.planner.explorations.tuscany.itineraries.terme.title',
        descriptionKey: 'pages.planner.explorations.tuscany.itineraries.terme.description',
        imageUrl:
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
        category: 'wellness',
        durationKey: 'pages.planner.explorations.tuscany.itineraries.terme.duration',
        stepKeys: [
          'pages.planner.explorations.tuscany.itineraries.terme.steps.0',
          'pages.planner.explorations.tuscany.itineraries.terme.steps.1',
        ],
      },
      {
        id: 'cycling-hills',
        titleKey: 'pages.planner.explorations.tuscany.itineraries.cycling.title',
        descriptionKey: 'pages.planner.explorations.tuscany.itineraries.cycling.description',
        imageUrl:
          'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=600&q=80',
        category: 'adventure',
        durationKey: 'pages.planner.explorations.tuscany.itineraries.cycling.duration',
        stepKeys: [
          'pages.planner.explorations.tuscany.itineraries.cycling.steps.0',
          'pages.planner.explorations.tuscany.itineraries.cycling.steps.1',
        ],
      },
    ],
  },
  kyoto: {
    id: 'kyoto',
    heroImage:
      'https://www.advantour.com/img/japan/images/kyoto.jpg',
    trip: {
      eyebrowKey: 'pages.planner.explorations.kyoto.trip.eyebrow',
      titleKey: 'pages.planner.explorations.kyoto.trip.title',
      datesKey: 'pages.planner.explorations.kyoto.trip.dates',
      travelersKey: 'pages.planner.explorations.kyoto.trip.travelers',
    },
    suggestedItineraries: [
      {
        id: 'fushimi-trail',
        titleKey: 'pages.planner.explorations.kyoto.itineraries.fushimi.title',
        descriptionKey: 'pages.planner.explorations.kyoto.itineraries.fushimi.description',
        imageUrl:
          'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=600&q=80',
        category: 'nature',
        durationKey: 'pages.planner.explorations.kyoto.itineraries.fushimi.duration',
        stepKeys: [
          'pages.planner.explorations.kyoto.itineraries.fushimi.steps.0',
          'pages.planner.explorations.kyoto.itineraries.fushimi.steps.1',
        ],
      },
      {
        id: 'onsen-retreat',
        titleKey: 'pages.planner.explorations.kyoto.itineraries.onsen.title',
        descriptionKey: 'pages.planner.explorations.kyoto.itineraries.onsen.description',
        imageUrl:
          'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&q=80',
        category: 'wellness',
        durationKey: 'pages.planner.explorations.kyoto.itineraries.onsen.duration',
        stepKeys: [
          'pages.planner.explorations.kyoto.itineraries.onsen.steps.0',
          'pages.planner.explorations.kyoto.itineraries.onsen.steps.1',
        ],
      },
      {
        id: 'night-walk',
        titleKey: 'pages.planner.explorations.kyoto.itineraries.gion.title',
        descriptionKey: 'pages.planner.explorations.kyoto.itineraries.gion.description',
        imageUrl:
          'https://citytravelcompanion.com/wp-content/uploads/2024/06/tasty_food_experiences_described.jpg',
        category: 'adventure',
        durationKey: 'pages.planner.explorations.kyoto.itineraries.gion.duration',
        stepKeys: [
          'pages.planner.explorations.kyoto.itineraries.gion.steps.0',
          'pages.planner.explorations.kyoto.itineraries.gion.steps.1',
        ],
      },
    ],
  },
  amalfi: {
    id: 'amalfi',
    heroImage:
      'https://amalfi-coast-tours.com/wp-content/uploads/2025/02/amalfi-coast-campania.jpg',
    trip: {
      eyebrowKey: 'pages.planner.explorations.amalfi.trip.eyebrow',
      titleKey: 'pages.planner.explorations.amalfi.trip.title',
      datesKey: 'pages.planner.explorations.amalfi.trip.dates',
      travelersKey: 'pages.planner.explorations.amalfi.trip.travelers',
    },
    suggestedItineraries: [
      {
        id: 'coastal-path',
        titleKey: 'pages.planner.explorations.amalfi.itineraries.path.title',
        descriptionKey: 'pages.planner.explorations.amalfi.itineraries.path.description',
        imageUrl:
          'https://images.squarespace-cdn.com/content/v1/5fbd372b643b627fb8281615/1914b398-3391-478b-bf56-e755daf538e6/Path+of+the+Gods+4.jpeg',
        category: 'nature',
        durationKey: 'pages.planner.explorations.amalfi.itineraries.path.duration',
        stepKeys: [
          'pages.planner.explorations.amalfi.itineraries.path.steps.0',
          'pages.planner.explorations.amalfi.itineraries.path.steps.1',
        ],
      },
      {
        id: 'boat-cruise',
        titleKey: 'pages.planner.explorations.amalfi.itineraries.boat.title',
        descriptionKey: 'pages.planner.explorations.amalfi.itineraries.boat.description',
        imageUrl:
          'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=600&q=80',
        category: 'wellness',
        durationKey: 'pages.planner.explorations.amalfi.itineraries.boat.duration',
        stepKeys: [
          'pages.planner.explorations.amalfi.itineraries.boat.steps.0',
          'pages.planner.explorations.amalfi.itineraries.boat.steps.1',
        ],
      },
      {
        id: 'ravello-concert',
        titleKey: 'pages.planner.explorations.amalfi.itineraries.ravello.title',
        descriptionKey: 'pages.planner.explorations.amalfi.itineraries.ravello.description',
        imageUrl:
          'https://www.lucatourguide.eu/wp-content/uploads/2025/02/art-ravello-01.webp',
        category: 'adventure',
        durationKey: 'pages.planner.explorations.amalfi.itineraries.ravello.duration',
        stepKeys: [
          'pages.planner.explorations.amalfi.itineraries.ravello.steps.0',
          'pages.planner.explorations.amalfi.itineraries.ravello.steps.1',
        ],
      },
    ],
  },
}

export const ACTIVE_EXPLORATION_ID: ExplorationId = 'iceland'

export const CITY_TO_EXPLORATION: Record<string, ExplorationId> = {
  amalfi: 'amalfi',
  florence: 'tuscany',
  kyoto: 'kyoto',
  reykjavik: 'iceland',
}
