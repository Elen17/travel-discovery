import type { HotelType } from '@/types/hotel'

export type DestinationsPageProps = Record<string, never>

export type DestinationAmenityFilter = 'infinity-pool' | 'private-beach'

export type DestinationPropertyType =
  | 'hotel'
  | 'resort'
  | 'guesthouse'
  | 'hostel'
  | 'apartment'
  | 'villa'

export type PropertyTypeFilter = DestinationPropertyType

export type StarRatingFilter = 1 | 2 | 3 | 4 | 5

export type DestinationFilters = {
  minPrice: number
  maxPrice: number
  country: string | null
  city: string | null
  propertyTypes: PropertyTypeFilter[]
  starRatings: StarRatingFilter[]
}

export type SidebarFiltersState = {
  priceRange: [number, number]
  country: string | null
  countryId: string | null
  city: string | null
  starRating: StarRatingFilter | null
  hotelType: HotelType | null
}
