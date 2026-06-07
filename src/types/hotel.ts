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
  id: string
  name: string
  description: string
  country: string
  city: string
  address: string
  lat: number
  lng: number
  pricePerNight: number
  starRating: number
  mainImageUrl: string
  amenities: HotelAmenity[]
  isFeatured?: boolean
}

export type HotelSearchParams = {
  city?: string
  country?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  minPrice?: number
  maxPrice?: number
  rating?: number
  amenities?: HotelAmenity[]
  page?: number
  size?: number
  sort?: string
}

export type HotelListResponse = {
  content: Hotel[]
  totalElements: number
  totalPages: number
  page: number
  size: number
}

export type HotelDetail = {
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
  amenities: string[]
  imageUrls: string[]
  averageRating: number
  reviewCount: number
}

export type HotelReview = {
  id: number
  userId: number
  rating: number
  comment: string
  createdAt: string
}

export type HotelReviewsPage = {
  content: HotelReview[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export type CreateHotelReviewPayload = {
  rating: number
  comment: string
}
