import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setSessionToken } from '@/store/plannerSlice'
import { EXPLORATION_CONTENT, PLANNER_I18N } from '../const'
import { buildShareUrl, getExplorationContent } from '../utils'

export const usePlannerShare = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { activeExplorationId, sessionToken } = useAppSelector((state) => state.planner)
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
    const token = sessionToken ?? `share_${activeExplorationId}_${Date.now()}`
    if (!sessionToken) {
      dispatch(setSessionToken(token))
    }
    const url = buildShareUrl(token, activeExplorationId)

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
  }, [activeExplorationId, dispatch, exploration.trip.titleKey, sessionToken, t])

  return { shareMessage, setShareMessage, handleShare }
}
