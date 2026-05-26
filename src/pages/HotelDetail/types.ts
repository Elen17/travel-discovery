import type { ComponentType } from 'react'

export type HotelDetailPageProps = Record<string, never>

export type HotelAmenityItem = {
  id: string
  labelKey: string
  icon: ComponentType<{ className?: string }>
}

export type HotelGalleryImage = {
  id: string
  url: string
  altKey: string
}

export type HotelReview = {
  id: string
  initials: string
  authorKey: string
  dateKey: string
  rating: number
  commentKey: string
}

export type HotelDetailData = {
  id: string
  name: string
  city: string
  country: string
  heroImageUrl: string
  guestRating: number
  reviewCount: number
  pricePerNight: number
  weatherTemp: number
  weatherConditionKey: string
  descriptionTitleKey: string
  descriptionParagraphKeys: string[]
  amenities: HotelAmenityItem[]
  gallery: HotelGalleryImage[]
  galleryTotalPhotos: number
  reviews: HotelReview[]
  serviceFee: number
  occupancyTaxRate: number
  defaultNights: number
}

import type { Dayjs } from 'dayjs'

export type BookingFormValues = {
  checkIn: Dayjs | null
  checkOut: Dayjs | null
  guests: string
}

export type BookingSummary = {
  nights: number
  subtotal: number
  serviceFee: number
  taxes: number
  total: number
}
