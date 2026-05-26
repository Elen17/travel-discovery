import type { ItineraryCategory } from '@/pages/Planner/types'

export type ItineraryPlanCardProps = {
  title: string
  description: string
  imageUrl: string
  category: ItineraryCategory
  categoryLabel: string
  duration: string
  usePlanLabel: string
  onUsePlan?: () => void
}
