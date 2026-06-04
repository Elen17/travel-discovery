import type { PropertyTypeFilter, StarRatingFilter } from './types'

export const DESTINATIONS_I18N = {
  heroTitle: 'pages.destinations.heroTitle',
  heroSubtitle: 'pages.destinations.heroSubtitle',
  resultsCount: 'pages.destinations.resultsCount',
  filters: {
    location: 'pages.destinations.filters.location',
    allCountries: 'pages.destinations.filters.allCountries',
    selectCity: 'pages.destinations.filters.selectCity',
    priceRange: 'pages.destinations.filters.priceRange',
    min: 'pages.destinations.filters.min',
    max: 'pages.destinations.filters.max',
    hotelType: 'pages.destinations.filters.hotelType',
    starRating: 'pages.destinations.filters.starRating',
    apply: 'pages.destinations.filters.apply',
    propertyHotel: 'pages.destinations.filters.propertyHotel',
    propertyResort: 'pages.destinations.filters.propertyResort',
    propertyGuesthouse: 'pages.destinations.filters.propertyGuesthouse',
    propertyHostel: 'pages.destinations.filters.propertyHostel',
    propertyApartment: 'pages.destinations.filters.propertyApartment',
    propertyVilla: 'pages.destinations.filters.propertyVilla',
  },
  card: {
    featured: 'pages.destinations.card.featured',
    perNight: 'pages.destinations.card.perNight',
    bookNow: 'pages.destinations.card.bookNow',
  },
} as const

export const PROPERTY_TYPE_FILTERS: PropertyTypeFilter[] = [
  'hotel',
  'resort',
  'guesthouse',
  'hostel',
  'apartment',
  'villa',
]

export const STAR_RATING_FILTERS: StarRatingFilter[] = [5, 4, 3, 2, 1]

export const PROPERTY_TYPE_I18N: Record<PropertyTypeFilter, string> = {
  hotel: DESTINATIONS_I18N.filters.propertyHotel,
  resort: DESTINATIONS_I18N.filters.propertyResort,
  guesthouse: DESTINATIONS_I18N.filters.propertyGuesthouse,
  hostel: DESTINATIONS_I18N.filters.propertyHostel,
  apartment: DESTINATIONS_I18N.filters.propertyApartment,
  villa: DESTINATIONS_I18N.filters.propertyVilla,
}

export const DEFAULT_PROPERTY_TYPES: PropertyTypeFilter[] = []
export const DEFAULT_STAR_RATINGS: StarRatingFilter[] = []

export const PRICE_RANGE = { min: 0, max: 2000 } as const

export const PAGE_SIZE = 9
