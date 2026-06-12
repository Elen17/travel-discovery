import type { ExplorationId, PlannerExploration } from '@/types/planner'

export type PlannerSidebarPlan = {
  id: string
  title: string
  meta: string
}

export type PlannerSidebarProps = {
  explorations: PlannerExploration[]
  activeExplorationId: ExplorationId
  plans: PlannerSidebarPlan[]
  activePlanId: string | null
  onSelectExploration: (id: ExplorationId) => void
  onSelectPlan: (id: string) => void
  onNewChat: () => void
  showNewChat?: boolean
  canNewChat?: boolean
  newChatHint?: string
}
