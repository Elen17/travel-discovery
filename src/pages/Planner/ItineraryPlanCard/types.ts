import type { ItineraryCategory } from '@/types/planner'

export type ItineraryPlanCardProps = {
  title: string
  description: string
  imageUrl: string
  category: ItineraryCategory
  categoryLabel: string
  duration: string
  usePlanLabel: string
  onUsePlan?: () => void
  onViewDetails?: () => void
}
