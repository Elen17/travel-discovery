export type PlannerSidebarPlan = {
  id: string
  title: string
  meta: string
}

export type PlannerSidebarProps = {
  plans: PlannerSidebarPlan[]
  activeId: string | null
  onSelect: (id: string) => void
  onNewChat: () => void
  showNewChat?: boolean
  canNewChat?: boolean
  newChatHint?: string
}
