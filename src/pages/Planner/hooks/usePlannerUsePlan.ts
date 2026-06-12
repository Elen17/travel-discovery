import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/store/hooks'
import { applyItinerary } from '@/store/plannerSlice'
import type { AppliedItinerary, SuggestedItinerary } from '@/types/planner'
import { PLANNER_I18N } from '../const'

export const usePlannerUsePlan = (
  setFeedbackMessage: (message: string | null) => void,
) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const handleUsePlan = useCallback(
    (item: SuggestedItinerary) => {
      const applied: AppliedItinerary = {
        id: item.id,
        titleKey: item.titleKey,
        title: item.title,
        durationKey: item.durationKey,
        duration: item.duration,
        category: item.category,
        appliedAt: new Date().toISOString(),
      }
      dispatch(applyItinerary(applied))
      setFeedbackMessage(t(PLANNER_I18N.applied.added))
    },
    [dispatch, setFeedbackMessage, t],
  )

  return handleUsePlan
}
