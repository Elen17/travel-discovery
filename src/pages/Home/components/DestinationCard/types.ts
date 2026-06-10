export type DestinationCardProps = {
  city: string
  country: string
  imageUrl: string
  avgPriceLabel: string
  hotelId: number
  isSaved?: boolean
  isSaving?: boolean
  onClick?: () => void
  onSave?: () => void
}
