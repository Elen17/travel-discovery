export type DestinationsPageProps = Record<string, never>

export type DestinationAmenityFilter = 'infinity-pool' | 'private-beach'

export type DestinationListing = {
  id: string
  name: string
  city: string
  country: string
  pricePerNight: number
  guestRating: number
  starRating: number
  imageUrl: string
  isFeatured: boolean
  amenities: DestinationAmenityFilter[]
}

export type DestinationFilters = {
  minPrice: number
  maxPrice: number
  minStarRating: number | null
  amenityFilters: DestinationAmenityFilter[]
}
