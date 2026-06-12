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
  cancelLabel?: string
  isCancelling?: boolean
  onGetDirections?: () => void
  onViewDetails?: () => void
  onCancel?: () => void
}
