import type { PlannerExploration } from '@/pages/Planner/types'

export type PlannerSidebarProps = {
  explorations: PlannerExploration[]
  activeId: string
  onSelect: (id: string) => void
  onNewChat: () => void
}
