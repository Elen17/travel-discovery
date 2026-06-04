import { useCallback, useMemo } from 'react'
import { PlannerSidebar } from '@/components/layout/PlannerSidebar'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setActiveExploration, startNewChat } from '@/store/plannerSlice'
import type { ExplorationId } from '@/types/planner'
import { AppliedItinerariesSection } from './components/AppliedItinerariesSection'
import { ItinerariesSection } from './components/ItinerariesSection'
import { PlannerChatSection } from './components/PlannerChatSection'
import { PlannerSkeleton } from './components/PlannerSkeleton'
import { PlannerTripSection } from './components/PlannerTripSection'
import { ShareAlert } from './components/ShareAlert'
import { EXPLORATION_CONTENT, RECENT_EXPLORATIONS } from './const'
import {
  usePlannerChat,
  usePlannerChatSend,
  usePlannerExportPdf,
  usePlannerHydration,
  usePlannerShare,
  usePlannerUsePlan,
} from './hooks'
import styles from './styles.module.css'
import { getExplorationContent } from './utils'

const PlannerPage = () => {
  const dispatch = useAppDispatch()
  usePlannerHydration()

  const { activeExplorationId, dynamicItineraries, isHydrated } = useAppSelector(
    (state) => state.planner,
  )

  const exploration = getExplorationContent(activeExplorationId, EXPLORATION_CONTENT)
  const displayedItineraries = useMemo(
    () => dynamicItineraries ?? exploration.suggestedItineraries,
    [dynamicItineraries, exploration.suggestedItineraries],
  )

  const { sendMessage, isSending } = usePlannerChat(activeExplorationId)
  const { shareMessage, setShareMessage, handleShare } = usePlannerShare()
  const handleExportPdf = usePlannerExportPdf(displayedItineraries)
  const handleUsePlan = usePlannerUsePlan(setShareMessage)
  const { handleChatSend, handleGenerateInsights } = usePlannerChatSend({
    activeExplorationId,
    sendMessage,
  })

  const handleSelectExploration = useCallback(
    (id: string) => {
      dispatch(setActiveExploration(id as ExplorationId))
    },
    [dispatch],
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
        activeId={activeExplorationId}
        onSelect={handleSelectExploration}
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
            itineraries={displayedItineraries}
            onUsePlan={handleUsePlan}
          />
        </div>
      </main>
    </div>
  )
}

export default PlannerPage
