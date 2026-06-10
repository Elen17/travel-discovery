import { DESTINATIONS_I18N, PRICE_RANGE, STAR_RATING_FILTERS } from '@/pages/Destinations/const'
import type { HotelType } from '@/types/hotel'

export const FILTER_I18N = DESTINATIONS_I18N.filters
export const FILTER_PRICE_RANGE = PRICE_RANGE
export const FILTER_STAR_RATINGS = STAR_RATING_FILTERS

export const HOTEL_TYPE_OPTIONS: { value: HotelType; labelKey: string }[] = [
  { value: 'HOTEL', labelKey: 'pages.destinations.filters.typeHotel' },
  { value: 'APARTMENT', labelKey: 'pages.destinations.filters.typeApartment' },
  { value: 'RESORT', labelKey: 'pages.destinations.filters.typeResort' },
  { value: 'VILLA', labelKey: 'pages.destinations.filters.typeVilla' },
  { value: 'GUEST_HOUSE', labelKey: 'pages.destinations.filters.typeGuestHouse' },
  { value: 'HOSTEL', labelKey: 'pages.destinations.filters.typeHostel' },
  { value: 'MOTEL', labelKey: 'pages.destinations.filters.typeMotel' },
  { value: 'OTHER', labelKey: 'pages.destinations.filters.typeOther' },
]
