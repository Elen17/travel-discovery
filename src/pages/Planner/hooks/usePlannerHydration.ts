import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { hydrateFromUrl, setHydrated, setMessages } from '@/store/plannerSlice'
import { usePlannerHistory } from './usePlannerApi'
import { parsePlannerSearchParams, resolveExplorationFromParams } from '../utils'

export const usePlannerHydration = () => {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const { sessionToken } = useAppSelector((state) => state.planner)

  const { data: historyMessages } = usePlannerHistory({
    sessionToken,
    enabled: isAuthenticated && Boolean(sessionToken),
  })

  useEffect(() => {
    const parsed = parsePlannerSearchParams(searchParams)
    const explorationId = resolveExplorationFromParams(parsed)
    dispatch(
      hydrateFromUrl({
        explorationId,
        sessionToken: parsed.session,
      }),
    )
    dispatch(setHydrated(true))
  }, [dispatch, searchParams])

  useEffect(() => {
    if (historyMessages && historyMessages.length > 0) {
      dispatch(setMessages(historyMessages))
    }
  }, [dispatch, historyMessages])
}
