import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/store/hooks'
import { EXPLORATION_CONTENT, PLANNER_I18N } from '../const'
import { buildShareUrl, getExplorationContent, isBackendPlanId } from '../utils'

export const usePlannerShare = () => {
  const { t } = useTranslation()
  const { activeExplorationId, planId } = useAppSelector((state) => state.planner)
  const exploration = getExplorationContent(activeExplorationId, EXPLORATION_CONTENT)
  const [shareMessage, setShareMessage] = useState<string | null>(null)

  useEffect(() => {
    if (shareMessage) {
      const timer = window.setTimeout(() => setShareMessage(null), 3000)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [shareMessage])

  const handleShare = useCallback(async () => {
    if (!isBackendPlanId(planId)) {
      setShareMessage(t(PLANNER_I18N.share.failed))
      return
    }

    const url = buildShareUrl(planId, activeExplorationId)

    if (navigator.share) {
      try {
        await navigator.share({
          title: t(exploration.trip.titleKey),
          url,
        })
        return
      } catch {
        // fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setShareMessage(t(PLANNER_I18N.share.copied))
    } catch {
      setShareMessage(t(PLANNER_I18N.share.failed))
    }
  }, [activeExplorationId, exploration.trip.titleKey, planId, t])

  return { shareMessage, setShareMessage, handleShare }
}
