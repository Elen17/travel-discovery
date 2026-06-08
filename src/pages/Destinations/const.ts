import type { DestinationListing, StarRatingFilter } from './types'

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
    open: 'pages.destinations.filters.open',
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

export const STAR_RATING_FILTERS: StarRatingFilter[] = [5, 4, 3, 2, 1]

export const PRICE_RANGE = { min: 0, max: 2000 } as const

export const PAGE_SIZE = 12

export const MOCK_LISTINGS: DestinationListing[] = [
  {
    id: 'azure-horizon-villa',
    name: 'Azure Horizon Villa',
    city: 'Santorini',
    country: 'Greece',
    pricePerNight: 450,
    guestRating: 4.9,
    starRating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1613395877344-13d4a461b9c3?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    amenities: ['infinity-pool', 'private-beach'],
  },
  {
    id: 'palazzo-di-pietra',
    name: 'Palazzo di Pietra',
    city: 'Amalfi Coast',
    country: 'Italy',
    pricePerNight: 620,
    guestRating: 4.8,
    starRating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    amenities: ['infinity-pool'],
  },
  {
    id: 'teal-waters-resort',
    name: 'Teal Waters Resort',
    city: 'Maldives',
    country: 'Maldives',
    pricePerNight: 890,
    guestRating: 5.0,
    starRating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1573843981267-be1999ffcd2b?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    amenities: ['private-beach', 'infinity-pool'],
  },
  {
    id: 'sage-enclave',
    name: 'The Sage Enclave',
    city: 'Sedona',
    country: 'USA',
    pricePerNight: 380,
    guestRating: 4.7,
    starRating: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    amenities: [],
  },
  {
    id: 'etoile-boutique',
    name: "L'Étoile Boutique",
    city: 'Paris',
    country: 'France',
    pricePerNight: 540,
    guestRating: 4.9,
    starRating: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    amenities: ['infinity-pool'],
  },
  {
    id: 'alpine-zenith-spa',
    name: 'Alpine Zenith Spa',
    city: 'Zermatt',
    country: 'Switzerland',
    pricePerNight: 710,
    guestRating: 4.8,
    starRating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3b4?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    amenities: ['infinity-pool'],
  },
]
