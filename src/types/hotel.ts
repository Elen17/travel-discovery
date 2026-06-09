export type HotelType =
  | 'HOTEL'
  | 'APARTMENT'
  | 'RESORT'
  | 'VILLA'
  | 'GUEST_HOUSE'
  | 'HOLIDAY_HOME'
  | 'HOSTEL'
  | 'MOTEL'
  | 'BED_AND_BREAKFAST'
  | 'CHALET'
  | 'APART_HOTEL'
  | 'OTHER'

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
  hotelType: HotelType
  mainImageUrl: string
  isFeatured: boolean
  amenities: HotelAmenity[]
  imageUrls: string[]
  averageRating?: number
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
  page?: number
  size?: number
  country?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  starRating?: number
  type?: HotelType
  sortBy?: string
}
