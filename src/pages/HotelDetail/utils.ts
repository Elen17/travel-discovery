import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import {
  DESCRIPTION_TITLE_KEY,
  HOTEL_DETAIL_BOOKING_DEFAULTS,
  HOTEL_DETAIL_I18N,
  HOTEL_DETAIL_WEATHER_DEFAULTS,
  mapAmenityToItem,
} from './const'
import type { BookingSummary, HotelDetailData, HotelDetailReview } from './types'
import type { HotelDetail, HotelReview } from '@/types/hotel'

export const mapHotelDetailToPageData = (hotel: HotelDetail): HotelDetailData => {
  const descriptionParagraphs = hotel.description.trim()
    ? hotel.description
        .split(/\n\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : [hotel.description.trim()].filter(Boolean)

  const galleryImages =
    hotel.imageUrls.length > 0 ? hotel.imageUrls : [hotel.mainImageUrl].filter(Boolean)

  return {
    id: String(hotel.id),
    name: hotel.name,
    city: hotel.city,
    country: hotel.country,
    latitude: hotel.latitude,
    longitude: hotel.longitude,
    heroImageUrl: hotel.mainImageUrl,
    guestRating: hotel.averageRating,
    reviewCount: hotel.reviewCount,
    pricePerNight: hotel.pricePerNight,
    weatherTemp: HOTEL_DETAIL_WEATHER_DEFAULTS.temp,
    weatherConditionKey: HOTEL_DETAIL_WEATHER_DEFAULTS.conditionKey,
    descriptionTitleKey: DESCRIPTION_TITLE_KEY,
    descriptionParagraphs,
    amenities: hotel.amenities.map(mapAmenityToItem),
    gallery: galleryImages.map((url, index) => ({
      id: String(index),
      url,
      altKey: HOTEL_DETAIL_I18N.gallery.photo,
    })),
    galleryTotalPhotos: galleryImages.length,
    serviceFee: HOTEL_DETAIL_BOOKING_DEFAULTS.serviceFee,
    occupancyTaxRate: HOTEL_DETAIL_BOOKING_DEFAULTS.occupancyTaxRate,
    defaultNights: HOTEL_DETAIL_BOOKING_DEFAULTS.defaultNights,
  }
}

export const mapHotelReviewsToPageData = (
  reviews: HotelReview[],
  guestLabel: (userId: number) => string,
  locale: string,
): HotelDetailReview[] =>
  reviews.map((review) => ({
    id: String(review.id),
    initials: `U${review.userId}`.slice(0, 2).toUpperCase(),
    author: guestLabel(review.userId),
    date: dayjs(review.createdAt).locale(locale).format('MMMM YYYY'),
    rating: review.rating,
    comment: review.comment,
  }))

export const calculateNights = (
  checkIn: Dayjs | null,
  checkOut: Dayjs | null,
  fallback: number,
): number => {
  if (!checkIn || !checkOut) return fallback
  const nights = checkOut.diff(checkIn, 'day')
  return nights > 0 ? nights : fallback
}

export const calculateGuestNightlyRate = (
  pricePerNight: number,
  guestCount: number,
): number => {
  const { baseGuestsIncluded, singleGuestRateRatio, extraGuestNightlyRateRatio } =
    HOTEL_DETAIL_BOOKING_DEFAULTS

  if (guestCount < baseGuestsIncluded) {
    return Math.round(pricePerNight * singleGuestRateRatio)
  }

  const extraGuests = guestCount - baseGuestsIncluded
  const extraGuestNightlyFee = Math.round(pricePerNight * extraGuestNightlyRateRatio)
  return pricePerNight + extraGuests * extraGuestNightlyFee
}

export const calculateBookingSummary = (
  hotel: HotelDetailData,
  nights: number,
  guestCount: number = HOTEL_DETAIL_BOOKING_DEFAULTS.baseGuestsIncluded,
): BookingSummary => {
  const nightlyRate = calculateGuestNightlyRate(hotel.pricePerNight, guestCount)
  const subtotal = nightlyRate * nights
  const serviceFee = hotel.serviceFee
  const taxes = Math.round(subtotal * hotel.occupancyTaxRate)
  const total = subtotal + serviceFee + taxes

  return { nights, nightlyRate, subtotal, serviceFee, taxes, total }
}

export const getDefaultDates = (nights: number): { checkIn: Dayjs; checkOut: Dayjs } => {
  const checkIn = dayjs().add(14, 'day')
  const checkOut = checkIn.add(nights, 'day')
  return { checkIn, checkOut }
}
