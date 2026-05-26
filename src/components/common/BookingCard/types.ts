export type BookingCardProps = {
  hotelName: string
  location: string
  datesLabel: string
  dateRange: string
  guestsRoom: string
  statusLabel: string
  statusVariant: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  imageUrl: string
  getDirectionsLabel: string
  viewDetailsLabel: string
  onGetDirections?: () => void
  onViewDetails?: () => void
}
