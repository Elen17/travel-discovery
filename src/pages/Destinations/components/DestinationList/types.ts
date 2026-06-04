import type { Hotel } from '@/types/hotel'

export type DestinationListProps = {
  hotels: Hotel[]
  totalResults: number
  isLoading: boolean
  onBookNow: (hotelId: number) => void
}
