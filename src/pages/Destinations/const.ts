import type { DestinationAmenityFilter, DestinationListing } from './types'

export const DESTINATIONS_I18N = {
  heroTitle: 'pages.destinations.heroTitle',
  heroSubtitle: 'pages.destinations.heroSubtitle',
  filters: {
    priceRange: 'pages.destinations.filters.priceRange',
    starRating: 'pages.destinations.filters.starRating',
    topFilters: 'pages.destinations.filters.topFilters',
    mapView: 'pages.destinations.filters.mapView',
    infinityPool: 'pages.destinations.filters.infinityPool',
    privateBeach: 'pages.destinations.filters.privateBeach',
  },
  card: {
    featured: 'pages.destinations.card.featured',
    perNight: 'pages.destinations.card.perNight',
    bookNow: 'pages.destinations.card.bookNow',
  },
} as const

export const PRICE_RANGE = {
  min: 200,
  max: 1200,
} as const

export const STAR_RATINGS = [1, 2, 3, 4, 5] as const

export const AMENITY_FILTERS: DestinationAmenityFilter[] = ['infinity-pool', 'private-beach']

export const AMENITY_FILTER_I18N: Record<DestinationAmenityFilter, string> = {
  'infinity-pool': DESTINATIONS_I18N.filters.infinityPool,
  'private-beach': DESTINATIONS_I18N.filters.privateBeach,
}

export const PAGE_SIZE = 6

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
