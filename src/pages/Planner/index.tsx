import { useCallback, useMemo, startTransition } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PlannerSidebar } from '@/components/layout/PlannerSidebar'
import type { PlannerSidebarPlan } from '@/components/layout/PlannerSidebar/types'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  loadPlan,
  restoreSession,
  setActiveExploration,
  setDynamicItineraries,
  startNewChat,
} from '@/store/plannerSlice'
import type { ExplorationId, PlannerPlan } from '@/types/planner'
import { AppliedItinerariesSection } from './components/AppliedItinerariesSection'
import { ItinerariesSection } from './components/ItinerariesSection'
import { PlannerChatSection } from './components/PlannerChatSection'
import { PlannerSkeleton } from './components/PlannerSkeleton'
import { PlannerTripSection } from './components/PlannerTripSection'
import { ShareAlert } from './components/ShareAlert'
import {
  usePlannerChatSend,
  usePlannerExportPdf,
  usePlannerHydration,
  usePlannerPlans,
  usePlannerShare,
  usePlannerUsePlan,
} from './hooks'
import { EXPLORATION_CONTENT, RECENT_EXPLORATIONS } from './const'
import styles from './styles.module.css'
import { getExplorationContent, plannerPlanToLoadPayload, suggestionsToItineraries } from './utils'
import { loadSavedSessions } from './utils/sessionStorage'

const formatPlanMeta = (plan: PlannerPlan): string => {
  const parts = [plan.explorationId]
  if (plan.duration) {
    parts.push(`${plan.duration}d`)
  }
  return parts.join(' · ')
}

const mapPlanToSidebarItem = (plan: PlannerPlan): PlannerSidebarPlan => ({
  id: plan.id,
  title: plan.title,
  meta: formatPlanMeta(plan),
})

const PlannerPage = () => {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  usePlannerHydration()

  const { activeExplorationId, dynamicItineraries, dynamicSuggestions, isHydrated, planId } =
    useAppSelector((state) => state.planner)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  const { data: dailyPlans = [] } = usePlannerPlans({ enabled: isAuthenticated })

  const sidebarPlans = useMemo(
    () => dailyPlans.map(mapPlanToSidebarItem),
    [dailyPlans],
  )

  const hourlyPlans = useMemo(() => {
    if (dynamicItineraries && dynamicItineraries.length > 0) {
      return dynamicItineraries
    }
    if (dynamicSuggestions && dynamicSuggestions.length > 0) {
      return suggestionsToItineraries(dynamicSuggestions, activeExplorationId)
    }
    return getExplorationContent(activeExplorationId, EXPLORATION_CONTENT).suggestedItineraries
  }, [activeExplorationId, dynamicItineraries, dynamicSuggestions])

  const { shareMessage, setShareMessage, handleShare } = usePlannerShare()
  const handleExportPdf = usePlannerExportPdf(hourlyPlans)
  const handleUsePlan = usePlannerUsePlan(setShareMessage)
  const { handleChatSend, handleGenerateInsights, isSending } = usePlannerChatSend({
    activeExplorationId,
  })

  const handleSelectExploration = useCallback(
    (id: ExplorationId) => {
      dispatch(setActiveExploration(id))
      const next = new URLSearchParams(searchParams)
      next.set('exploration', id)
      next.delete('session')
      setSearchParams(next, { replace: true })
    },
    [dispatch, searchParams, setSearchParams],
  )

  const handleSelectPlan = useCallback(
    (id: string) => {
      const selected = dailyPlans.find((plan) => plan.id === id)
      if (selected) {
        dispatch(loadPlan(plannerPlanToLoadPayload(selected)))
        const next = new URLSearchParams(searchParams)
        next.set('session', selected.id)
        next.set('exploration', selected.explorationId)
        startTransition(() => {
          setSearchParams(next, { replace: true })
        })
        return
      }

      if (!isAuthenticated) {
        const savedSession = loadSavedSessions().find((session) => session.id === id)
        if (savedSession) {
          dispatch(restoreSession(savedSession))
          if (savedSession.dynamicSuggestions?.length) {
            dispatch(
              setDynamicItineraries(
                suggestionsToItineraries(
                  savedSession.dynamicSuggestions,
                  savedSession.explorationId,
                ),
              ),
            )
          }
        }
      }
    },
    [dailyPlans, dispatch, isAuthenticated, searchParams, setSearchParams],
  )

  const handleNewChat = useCallback(() => {
    dispatch(startNewChat())
  }, [dispatch])

  if (!isHydrated) {
    return <PlannerSkeleton />
  }

  return (
    <div className={styles.page}>
      <PlannerSidebar
        explorations={RECENT_EXPLORATIONS}
        activeExplorationId={activeExplorationId}
        plans={sidebarPlans}
        activePlanId={planId}
        onSelectExploration={handleSelectExploration}
        onSelectPlan={handleSelectPlan}
        showNewChat={isAuthenticated}
        onNewChat={handleNewChat}
      />

      <main className={styles.main}>
        <ShareAlert
          message={shareMessage}
          onClose={() => setShareMessage(null)}
        />

        <div className={styles.tripColumn}>
          <PlannerTripSection
            onShare={() => void handleShare()}
            onExportPdf={handleExportPdf}
            onGenerateInsights={handleGenerateInsights}
            isGenerating={isSending}
          />

          <PlannerChatSection
            isSending={isSending}
            onSend={(message) => void handleChatSend(message)}
          />

          <AppliedItinerariesSection />

          <ItinerariesSection
            itineraries={hourlyPlans}
            onUsePlan={handleUsePlan}
          />
        </div>
      </main>
    </div>
  )
}

export default PlannerPage
