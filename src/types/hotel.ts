export type HotelAmenity =
  | 'WIFI'
  | 'POOL'
  | 'GYM'
  | 'SPA'
  | 'RESTAURANT'
  | 'PARKING'
  | 'PET_FRIENDLY'
  | 'KIDS_ACTIVITIES'

export type Hotel = {
  id: number
  name: string
  description: string
  country: string
  city: string
  address: string
  latitude: number
  longitude: number
  pricePerNight: number
  starRating: number
  mainImageUrl: string
  isFeatured: boolean
  amenities: HotelAmenity[]
  imageUrls: string[]
  averageRating: number
  reviewCount: number
}

/** Live search — ingests fresh results, returns a plain array. */
export type HotelLiveSearchParams = {
  country: string
  city: string
  checkIn?: string
  checkOut?: string
  adults?: number
}

/** Catalog listing with filters — paginated. */
export type HotelCatalogParams = {
  country: string
  city: string
  starRating?: number
  page?: number
  size?: number
}
