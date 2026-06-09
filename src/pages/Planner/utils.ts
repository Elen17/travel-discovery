import { jsPDF } from 'jspdf'
import type {
  AppliedItinerary,
  ExplorationContent,
  ExplorationId,
  PlannerAppliedItinerary,
  PlannerAppliedItineraryItem,
  PlannerMessage,
  PlannerPlan,
  PlannerPlanPayload,
  PlannerSearchParams,
  PlannerSuggestion,
  SavedPlannerSession,
  SuggestedItinerary,
} from '@/types/planner'
import type { TripPlanPdfContent } from './types'
import { DEFAULT_EXPLORATION_ID, isKnownExplorationId } from '@/utils/exploration'

export {
  isBackendPlanId,
  normalizePlanId,
  toChatPlanId,
} from '@/utils/plannerPlanId'

export { isKnownExplorationId, isExplorationId } from '@/utils/exploration'

const COUNTRY_TO_EXPLORATION: Record<string, ExplorationId> = {
  iceland: 'iceland',
  tuscany: 'tuscany',
  italy: 'amalfi',
  amalfi: 'amalfi',
  japan: 'kyoto',
  kyoto: 'kyoto',
  greece: 'amalfi',
  maldives: 'iceland',
}

export const resolveExplorationFromDestination = (
  destination?: string,
): ExplorationId | undefined => {
  if (!destination) {
    return undefined
  }
  const key = destination.toLowerCase().trim()
  if (isKnownExplorationId(key)) {
    return key
  }
  return COUNTRY_TO_EXPLORATION[key]
}

export const parsePlannerSearchParams = (
  params: URLSearchParams,
): PlannerSearchParams => ({
  exploration: params.get('exploration') ?? undefined,
  destination: params.get('destination') ?? undefined,
  hotelId: params.get('hotelId') ?? undefined,
  hotelName: params.get('hotelName') ?? undefined,
  dates: params.get('dates') ?? undefined,
  guests: params.get('guests') ?? undefined,
  session: params.get('session') ?? undefined,
})

export const resolveExplorationFromParams = (
  params: PlannerSearchParams,
): ExplorationId => {
  if (params.exploration) {
    return params.exploration
  }
  const fromDestination = resolveExplorationFromDestination(params.destination)
  if (fromDestination) {
    return fromDestination
  }
  return DEFAULT_EXPLORATION_ID
}

export const buildPlannerUrl = (params: PlannerSearchParams): string => {
  const search = new URLSearchParams()
  if (params.exploration) {
    search.set('exploration', params.exploration)
  }
  if (params.destination) {
    search.set('destination', params.destination)
  }
  if (params.hotelId) {
    search.set('hotelId', params.hotelId)
  }
  if (params.hotelName) {
    search.set('hotelName', params.hotelName)
  }
  if (params.dates) {
    search.set('dates', params.dates)
  }
  if (params.guests) {
    search.set('guests', params.guests)
  }
  if (params.session) {
    search.set('session', params.session)
  }
  const query = search.toString()
  return query ? `/planner?${query}` : '/planner'
}

export const buildShareUrl = (planId: string, explorationId: ExplorationId): string => {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/planner?session=${encodeURIComponent(planId)}&exploration=${explorationId}`
}

export const getExplorationContent = (
  id: string,
  contentMap: Record<string, ExplorationContent>,
): ExplorationContent => contentMap[id] ?? contentMap[DEFAULT_EXPLORATION_ID]

export const suggestionsToItineraries = (
  suggestions: PlannerSuggestion[],
  explorationId: ExplorationId,
): SuggestedItinerary[] =>
  suggestions.map((item) => ({
    id: item.id,
    titleKey: `pages.planner.explorations.${explorationId}.dynamic.${item.id}.title`,
    descriptionKey: `pages.planner.explorations.${explorationId}.dynamic.${item.id}.description`,
    imageUrl: getDefaultImageForSuggestion(explorationId, item.category),
    category: item.category,
    durationKey: `pages.planner.explorations.${explorationId}.dynamic.${item.id}.duration`,
    title: item.title,
    description: item.description,
    duration: item.duration,
    steps: item.steps,
  }))

const getDefaultImageForSuggestion = (
  explorationId: ExplorationId,
  category: SuggestedItinerary['category'],
): string => {
  const images: Record<string, Record<SuggestedItinerary['category'], string>> = {
    iceland: {
      nature:
        'https://images.unsplash.com/photo-1529963183137-3323fab7c7fb?auto=format&fit=crop&w=600&q=80',
      wellness:
        'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=600&q=80',
      adventure:
        'https://images.unsplash.com/photo-1531168556467-80aace0d48f1?auto=format&fit=crop&w=600&q=80',
    },
    tuscany: {
      nature:
        'https://images.unsplash.com/photo-1523531294911-0b948c834cfb?auto=format&fit=crop&w=600&q=80',
      wellness:
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      adventure:
        'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=600&q=80',
    },
    kyoto: {
      nature:
        'https://images.unsplash.com/photo-1493976040374-85c8e412f188?auto=format&fit=crop&w=600&q=80',
      wellness:
        'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&q=80',
      adventure:
        'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=600&q=80',
    },
    amalfi: {
      nature:
        'https://images.unsplash.com/photo-15341134145014-8745f22b55a4?auto=format&fit=crop&w=600&q=80',
      wellness:
        'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=600&q=80',
      adventure:
        'https://images.unsplash.com/photo-1516483638265-f4dbf994554a?auto=format&fit=crop&w=600&q=80',
    },
  }
  return images[explorationId]?.[category] ?? images[DEFAULT_EXPLORATION_ID][category]
}

export const apiAppliedToUi = (item: PlannerAppliedItinerary): AppliedItinerary => ({
  id: String(item.id),
  titleKey: '',
  title: item.title,
  description: item.description,
  durationKey: '',
  category: 'nature',
  appliedAt: new Date().toISOString(),
})

export const uiAppliedToApi = (item: AppliedItinerary): PlannerAppliedItineraryItem => ({
  title: item.title ?? item.id,
  description: item.description ?? item.duration,
})

export const buildPlannerPlanPayload = (
  title: string,
  explorationId: ExplorationId,
  messages: PlannerMessage[],
  appliedItineraries: AppliedItinerary[],
  exploration: ExplorationContent,
): PlannerPlanPayload => ({
  title,
  explorationId,
  imageUrl: exploration.heroImage,
  messages,
  appliedItineraries: appliedItineraries.map(uiAppliedToApi),
})

export const plannerPlanToSavedSession = (plan: PlannerPlan): SavedPlannerSession => ({
  id: plan.id,
  title: plan.title,
  explorationId: plan.explorationId,
  messages: plan.messages,
  appliedItineraries: plan.appliedItineraries.map(apiAppliedToUi),
  dynamicSuggestions: null,
  savedAt: plan.createdAt,
  updatedAt: plan.updatedAt,
})

export const buildGenerateInsightsPrompt = (explorationId: ExplorationId): string =>
  `Generate insights for my ${explorationId} trip based on my preferences and today's weather.`

export const buildHotelContextPrompt = (hotelName: string, destination: string): string =>
  `Help me plan a trip around ${hotelName} in ${destination}. Suggest day itineraries nearby.`

const PDF_MARGIN = 20
const PDF_LINE_HEIGHT = 6
const PDF_CONTENT_WIDTH = 170

const slugifyFilename = (value: string): string => {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug.length > 0 ? slug : 'travel-plan'
}

const ensurePdfSpace = (doc: jsPDF, y: number, needed: number): number => {
  const pageHeight = doc.internal.pageSize.getHeight()
  if (y + needed > pageHeight - PDF_MARGIN) {
    doc.addPage()
    return PDF_MARGIN
  }
  return y
}

const writePdfLines = (
  doc: jsPDF,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number,
): number => {
  let cursorY = y
  for (const line of lines) {
    cursorY = ensurePdfSpace(doc, cursorY, lineHeight)
    doc.text(line, x, cursorY)
    cursorY += lineHeight
  }
  return cursorY
}

export const downloadTripPlanPdf = (content: TripPlanPdfContent): void => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let y = PDF_MARGIN

  const addHeading = (text: string, size: number) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(size)
    y = writePdfLines(doc, [text], PDF_MARGIN, y, PDF_LINE_HEIGHT + (size > 14 ? 2 : 0))
    y += 2
  }

  const addBody = (text: string, size = 11) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(size)
    const lines = doc.splitTextToSize(text, PDF_CONTENT_WIDTH)
    y = writePdfLines(doc, lines, PDF_MARGIN, y, PDF_LINE_HEIGHT)
    y += 2
  }

  addHeading(content.documentTitle, 18)
  addHeading(content.tripTitle, 16)
  addBody(`${content.tripDates} · ${content.tripTravelers}`, 11)
  y += 4

  if (content.appliedItems.length > 0) {
    addHeading(content.appliedSectionTitle, 14)
    for (const item of content.appliedItems) {
      addBody(`${item.title} — ${item.meta}`, 11)
    }
    y += 4
  }

  addHeading(content.itinerariesSectionTitle, 14)
  addBody(content.itinerariesSubtitle, 10)
  y += 2

  for (const itinerary of content.itineraries) {
    y = ensurePdfSpace(doc, y, PDF_LINE_HEIGHT * 4)
    addHeading(itinerary.title, 12)
    addBody(`${itinerary.category} · ${itinerary.duration}`, 10)
    addBody(itinerary.description, 10)

    if (itinerary.steps.length > 0) {
      addBody(itinerary.stepsLabel, 10)
      itinerary.steps.forEach((step, index) => {
        addBody(`${index + 1}. ${step}`, 10)
      })
    }

    y += 4
  }

  const filename = `${slugifyFilename(content.filenameBase)}-travel-plan.pdf`
  doc.save(filename)
}
