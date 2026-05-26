import type { DestinationAmenityFilter } from '@/pages/Destinations/types'

export type DestinationsFilterBarProps = {
  priceRange: [number, number]
  selectedStarRating: number | null
  selectedAmenities: DestinationAmenityFilter[]
  onPriceChange: (range: [number, number]) => void
  onStarRatingChange: (rating: number | null) => void
  onAmenityToggle: (amenity: DestinationAmenityFilter) => void
  onMapViewClick?: () => void
}
