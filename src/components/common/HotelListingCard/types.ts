export type HotelListingCardProps = {
  id: string
  name: string
  location: string
  priceLabel: string
  perNightLabel: string
  guestRating: number
  imageUrl: string
  isFeatured: boolean
  featuredLabel: string
  bookNowLabel: string
  saveLabel: string
  savedLabel?: string
  isSaved?: boolean
  isSaving?: boolean
  onBookNow?: () => void
  onSave?: () => void
}
