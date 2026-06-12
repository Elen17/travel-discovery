export type SavedPlaceCardProps = {
  name: string
  country: string
  description: string
  guestRating?: number
  imageUrl: string
  bookNowLabel: string
  planWithAiLabel: string
  removeLabel: string
  onBookNow?: () => void
  onPlanWithAi?: () => void
  onRemove?: () => void
}
