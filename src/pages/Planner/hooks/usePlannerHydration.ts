import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { hydrateFromUrl, loadPlan, setHydrated, setMessages } from '@/store/plannerSlice'
import { isBackendPlanId } from '@/utils/plannerPlanId'
import { usePlannerHistory, usePlannerPlans } from './usePlannerApi'
import { parsePlannerSearchParams, plannerPlanToLoadPayload, resolveExplorationFromParams } from '../utils'

const buildUrlKey = (searchParams: URLSearchParams): string => {
  const parsed = parsePlannerSearchParams(searchParams)
  return `${parsed.exploration ?? ''}|${parsed.session ?? ''}`
}

export const usePlannerHydration = () => {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const { activePlan, messages, planId } = useAppSelector((state) => state.planner)
  const loadedHistoryPlanIdRef = useRef<string | null>(null)
  const lastUrlKeyRef = useRef<string | null>(null)

  const { data: plans = [] } = usePlannerPlans({ enabled: isAuthenticated })

  const shouldFetchHistory =
    Boolean(planId) && isBackendPlanId(planId) && messages.length === 0

  const { data: historyMessages } = usePlannerHistory({
    planId,
    enabled: shouldFetchHistory,
  })

  useEffect(() => {
    const urlKey = buildUrlKey(searchParams)
    const parsed = parsePlannerSearchParams(searchParams)
    const explorationId = resolveExplorationFromParams(parsed)

    if (urlKey !== lastUrlKeyRef.current) {
      lastUrlKeyRef.current = urlKey
      if (parsed.session !== planId) {
        loadedHistoryPlanIdRef.current = null
      }
    }

    dispatch(
      hydrateFromUrl({
        ...(explorationId ? { explorationId } : {}),
        ...(parsed.session ? { planId: parsed.session } : {}),
      }),
    )
    dispatch(setHydrated(true))
  }, [dispatch, planId, searchParams])

  useEffect(() => {
    if (!isAuthenticated || plans.length === 0 || activePlan !== null) {
      return
    }

    const sessionId = searchParams.get('session')
    if (!sessionId) {
      return
    }

    const plan = plans.find((item) => item.id === sessionId)
    if (!plan) {
      return
    }

    dispatch(loadPlan(plannerPlanToLoadPayload(plan)))
  }, [activePlan, dispatch, isAuthenticated, plans, searchParams])

  useEffect(() => {
    if (!shouldFetchHistory || !historyMessages || historyMessages.length === 0) {
      return
    }
    if (loadedHistoryPlanIdRef.current === planId) {
      return
    }
    loadedHistoryPlanIdRef.current = planId
    dispatch(setMessages(historyMessages))
  }, [dispatch, historyMessages, planId, shouldFetchHistory])
}
