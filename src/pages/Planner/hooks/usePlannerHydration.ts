import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { hydrateFromUrl, setHydrated, setMessages } from '@/store/plannerSlice'
import { isBackendPlanId } from '@/utils/plannerPlanId'
import { usePlannerHistory, usePlannerPlans } from './usePlannerApi'
import { parsePlannerSearchParams, resolveExplorationFromParams } from '../utils'

export const usePlannerHydration = () => {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const { planId } = useAppSelector((state) => state.planner)
  const loadedHistoryPlanIdRef = useRef<string | null>(null)

  usePlannerPlans({ enabled: isAuthenticated })

  const { data: historyMessages } = usePlannerHistory({
    planId,
    enabled: isAuthenticated && isBackendPlanId(planId),
  })

  useEffect(() => {
    const parsed = parsePlannerSearchParams(searchParams)
    const explorationId = resolveExplorationFromParams(parsed)
    dispatch(
      hydrateFromUrl({
        explorationId,
        planId: parsed.session,
      }),
    )
    dispatch(setHydrated(true))
    loadedHistoryPlanIdRef.current = null
  }, [dispatch, searchParams])

  useEffect(() => {
    if (!isBackendPlanId(planId) || !historyMessages || historyMessages.length === 0) {
      return
    }
    if (loadedHistoryPlanIdRef.current === planId) {
      return
    }
    loadedHistoryPlanIdRef.current = planId
    dispatch(setMessages(historyMessages))
  }, [dispatch, historyMessages, planId])
}
