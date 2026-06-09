import { useCallback, useMemo } from 'react'
import { PlannerSidebar } from '@/components/layout/PlannerSidebar'
import type { PlannerSidebarPlan } from '@/components/layout/PlannerSidebar/types'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loadPlan, startNewChat } from '@/store/plannerSlice'
import type { PlannerPlan } from '@/types/planner'
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
import styles from './styles.module.css'
import { apiAppliedToUi } from './utils'

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
  usePlannerHydration()

  const { activeExplorationId, dynamicItineraries, isHydrated, planId } = useAppSelector(
    (state) => state.planner,
  )
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  const { data: dailyPlans = [] } = usePlannerPlans({ enabled: isAuthenticated })

  const sidebarPlans = useMemo(
    () => dailyPlans.map(mapPlanToSidebarItem),
    [dailyPlans],
  )

  const hourlyPlans = useMemo(() => dynamicItineraries ?? [], [dynamicItineraries])

  const { shareMessage, setShareMessage, handleShare } = usePlannerShare()
  const handleExportPdf = usePlannerExportPdf(hourlyPlans)
  const handleUsePlan = usePlannerUsePlan(setShareMessage)
  const { handleChatSend, handleGenerateInsights, isSending } = usePlannerChatSend({
    activeExplorationId,
  })

  const handleSelectPlan = useCallback(
    (id: string) => {
      const selected = dailyPlans.find((plan) => plan.id === id)
      if (!selected) {
        return
      }

      dispatch(
        loadPlan({
          planId: selected.id,
          explorationId: selected.explorationId,
          messages: selected.messages,
          appliedItineraries: selected.appliedItineraries.map(apiAppliedToUi),
        }),
      )
    },
    [dailyPlans, dispatch],
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
        plans={sidebarPlans}
        activeId={planId}
        onSelect={handleSelectPlan}
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
