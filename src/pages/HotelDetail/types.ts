import type { ComponentType } from 'react'
import type { Dayjs } from 'dayjs'

export type HotelDetailPageProps = Record<string, never>

export type HotelAmenityItem = {
  id: string
  labelKey?: string
  label?: string
  icon: ComponentType<{ className?: string }>
}

export type HotelGalleryImage = {
  id: string
  url: string
  altKey: string
}

export type HotelDetailReview = {
  id: string
  initials: string
  author: string
  date: string
  rating: number
  comment: string
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
  descriptionParagraphs: string[]
  amenities: HotelAmenityItem[]
  gallery: HotelGalleryImage[]
  galleryTotalPhotos: number
  serviceFee: number
  occupancyTaxRate: number
  defaultNights: number
  latitude: number
  longitude: number
}

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
