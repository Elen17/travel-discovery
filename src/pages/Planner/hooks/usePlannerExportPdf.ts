import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/store/hooks'
import type { SuggestedItinerary } from '@/types/planner'
import { CATEGORY_I18N_KEYS, EXPLORATION_CONTENT, PLANNER_I18N } from '../const'
import { downloadTripPlanPdf, getExplorationContent } from '../utils'

export const usePlannerExportPdf = (displayedItineraries: SuggestedItinerary[]) => {
  const { t } = useTranslation()
  const { activeExplorationId, appliedItineraries } = useAppSelector((state) => state.planner)
  const exploration = getExplorationContent(activeExplorationId, EXPLORATION_CONTENT)

  const handleExportPdf = useCallback(() => {
    downloadTripPlanPdf({
      documentTitle: t(PLANNER_I18N.print.title),
      tripTitle: t(exploration.trip.titleKey),
      tripDates: t(exploration.trip.datesKey),
      tripTravelers: t(exploration.trip.travelersKey),
      appliedSectionTitle: t(PLANNER_I18N.applied.title),
      appliedItems: appliedItineraries.map((item) => ({
        title: item.title ?? t(item.titleKey),
        meta:
          item.description ??
          `${t(CATEGORY_I18N_KEYS[item.category])} · ${item.duration ?? t(item.durationKey)}`,
      })),
      itinerariesSectionTitle: t(PLANNER_I18N.itineraries.title),
      itinerariesSubtitle: t(PLANNER_I18N.itineraries.subtitle),
      itineraries: displayedItineraries.map((item) => ({
        title: item.title ?? t(item.titleKey),
        description: item.description ?? t(item.descriptionKey),
        category: t(CATEGORY_I18N_KEYS[item.category]),
        duration: item.duration ?? t(item.durationKey),
        stepsLabel: t(PLANNER_I18N.drawer.steps),
        steps: item.steps ?? item.stepKeys?.map((stepKey) => t(stepKey)) ?? [],
      })),
      filenameBase: t(exploration.trip.titleKey),
    })
  }, [t, exploration, appliedItineraries, displayedItineraries])

  return handleExportPdf
}
