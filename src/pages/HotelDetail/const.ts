import {
  AppstoreOutlined,
  CoffeeOutlined,
  FireOutlined,
  SkinOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import type { HotelAmenityItem } from './types'

export const HOTEL_DETAIL_I18N = {
  reviewsCount: 'pages.hotelDetail.reviewsCount',
  descriptionTitle: 'pages.hotelDetail.descriptionTitle',
  amenitiesTitle: 'pages.hotelDetail.amenitiesTitle',
  galleryTitle: 'pages.hotelDetail.galleryTitle',
  galleryViewAll: 'pages.hotelDetail.galleryViewAll',
  reviewsTitle: 'pages.hotelDetail.reviewsTitle',
  reviewsSummary: 'pages.hotelDetail.reviewsSummary',
  reviewsExceptional: 'pages.hotelDetail.reviewsExceptional',
  notFound: 'pages.hotelDetail.notFound',
  loadError: 'pages.hotelDetail.loadError',
  booking: {
    perNight: 'pages.hotelDetail.booking.perNight',
    checkIn: 'pages.hotelDetail.booking.checkIn',
    checkOut: 'pages.hotelDetail.booking.checkOut',
    guests: 'pages.hotelDetail.booking.guests',
    guestsPlaceholder: 'pages.hotelDetail.booking.guestsPlaceholder',
    nightsLine: 'pages.hotelDetail.booking.nightsLine',
    serviceFee: 'pages.hotelDetail.booking.serviceFee',
    taxes: 'pages.hotelDetail.booking.taxes',
    total: 'pages.hotelDetail.booking.total',
    bookNow: 'pages.hotelDetail.booking.bookNow',
    notCharged: 'pages.hotelDetail.booking.notCharged',
    createError: 'pages.hotelDetail.booking.createError',
    safeBooking: 'pages.hotelDetail.booking.safeBooking',
    freeCancellation: 'pages.hotelDetail.booking.freeCancellation',
  },
  weather: {
    sunny: 'pages.hotelDetail.weather.sunny',
  },
  amenities: {
    infinityPool: 'pages.hotelDetail.amenities.infinityPool',
    oceanSpa: 'pages.hotelDetail.amenities.oceanSpa',
    michelinDining: 'pages.hotelDetail.amenities.michelinDining',
    yogaStudio: 'pages.hotelDetail.amenities.yogaStudio',
    wifi: 'pages.hotelDetail.amenities.wifi',
    gym: 'pages.hotelDetail.amenities.gym',
    parking: 'pages.hotelDetail.amenities.parking',
    restaurant: 'pages.hotelDetail.amenities.restaurant',
    petFriendly: 'pages.hotelDetail.amenities.petFriendly',
    kidsActivities: 'pages.hotelDetail.amenities.kidsActivities',
  },
  gallery: {
    photo: 'pages.hotelDetail.gallery.photo',
  },
  reviews: {
    guest: 'pages.hotelDetail.reviews.guest',
  },
} as const

export const GUEST_OPTIONS = [
  { value: '2-0', labelKey: 'pages.hotelDetail.booking.guestOption2Adults' },
  { value: '2-1', labelKey: 'pages.hotelDetail.booking.guestOption2Adults1Child' },
  { value: '1-0', labelKey: 'pages.hotelDetail.booking.guestOption1Adult' },
] as const

export const DEFAULT_GUEST_VALUE = '2-1'

export const DESCRIPTION_TITLE_KEY = 'pages.hotelDetail.descriptions.default.title'

export const HOTEL_DETAIL_BOOKING_DEFAULTS = {
  serviceFee: 120,
  occupancyTaxRate: 0.12,
  defaultNights: 6,
  baseGuestsIncluded: 2,
  singleGuestRateRatio: 0.85,
  extraGuestNightlyRateRatio: 0.25,
} as const

export const HOTEL_DETAIL_WEATHER_DEFAULTS = {
  temp: 18,
  conditionKey: HOTEL_DETAIL_I18N.weather.sunny,
} as const

const AMENITY_ICON_MAP: Record<
  string,
  Pick<HotelAmenityItem, 'icon' | 'labelKey'>
> = {
  POOL: { icon: ThunderboltOutlined, labelKey: HOTEL_DETAIL_I18N.amenities.infinityPool },
  INFINITY_POOL: { icon: ThunderboltOutlined, labelKey: HOTEL_DETAIL_I18N.amenities.infinityPool },
  SPA: { icon: SkinOutlined, labelKey: HOTEL_DETAIL_I18N.amenities.oceanSpa },
  OCEAN_SPA: { icon: SkinOutlined, labelKey: HOTEL_DETAIL_I18N.amenities.oceanSpa },
  RESTAURANT: { icon: CoffeeOutlined, labelKey: HOTEL_DETAIL_I18N.amenities.michelinDining },
  MICHELIN_DINING: { icon: CoffeeOutlined, labelKey: HOTEL_DETAIL_I18N.amenities.michelinDining },
  YOGA: { icon: FireOutlined, labelKey: HOTEL_DETAIL_I18N.amenities.yogaStudio },
  YOGA_STUDIO: { icon: FireOutlined, labelKey: HOTEL_DETAIL_I18N.amenities.yogaStudio },
  WIFI: { icon: AppstoreOutlined, labelKey: HOTEL_DETAIL_I18N.amenities.wifi },
  GYM: { icon: FireOutlined, labelKey: HOTEL_DETAIL_I18N.amenities.gym },
  PARKING: { icon: AppstoreOutlined, labelKey: HOTEL_DETAIL_I18N.amenities.parking },
  PET_FRIENDLY: { icon: AppstoreOutlined, labelKey: HOTEL_DETAIL_I18N.amenities.petFriendly },
  KIDS_ACTIVITIES: { icon: AppstoreOutlined, labelKey: HOTEL_DETAIL_I18N.amenities.kidsActivities },
}

export const normalizeAmenityKey = (amenity: string): string =>
  amenity.trim().toUpperCase().replace(/[\s-]+/g, '_')

export const mapAmenityToItem = (amenity: string): HotelAmenityItem => {
  const key = normalizeAmenityKey(amenity)
  const config = AMENITY_ICON_MAP[key]
  if (config) {
    return { id: key, icon: config.icon, labelKey: config.labelKey }
  }
  return { id: key, icon: AppstoreOutlined, label: amenity }
}
