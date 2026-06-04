import type { ProfileUserDisplay, SavedPlace } from './types'

export const PROFILE_I18N = {
  verified: 'pages.profile.verified',
  logout: 'pages.profile.logout',
  tabs: {
    savedPlaces: 'pages.profile.tabs.savedPlaces',
  },
  actions: {
    bookNow: 'pages.profile.actions.bookNow',
    planWithAi: 'pages.profile.actions.planWithAi',
    removeSaved: 'pages.profile.actions.removeSaved',
  },
} as const

export const MOCK_PROFILE_USER: ProfileUserDisplay = {
  fullName: 'Julian Thorne',
  avatarUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
}

export const MOCK_SAVED_PLACES: SavedPlace[] = [
  {
    id: 'villa-margherita',
    name: 'Villa Margherita',
    country: 'Italy',
    countryKey: 'pages.profile.savedPlaces.villaMargherita.country',
    guestRating: 4.9,
    descriptionKey: 'pages.profile.savedPlaces.villaMargherita.description',
    imageUrl:
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80',
    hotelId: 'palazzo-di-pietra',
  },
  {
    id: 'ryokan-hana',
    name: 'Ryokan Hana',
    country: 'Japan',
    countryKey: 'pages.profile.savedPlaces.ryokanHana.country',
    guestRating: 4.8,
    descriptionKey: 'pages.profile.savedPlaces.ryokanHana.description',
    imageUrl:
      'https://images.unsplash.com/photo-1493976040374-85c8e412f188?auto=format&fit=crop&w=800&q=80',
    hotelId: 'etoile-boutique',
  },
  {
    id: 'azure-horizon',
    name: 'Azure Horizon Villa',
    country: 'Greece',
    countryKey: 'pages.profile.savedPlaces.azureHorizon.country',
    guestRating: 4.9,
    descriptionKey: 'pages.profile.savedPlaces.azureHorizon.description',
    imageUrl:
      'https://images.unsplash.com/photo-1613395877344-13d4a461b9c3?auto=format&fit=crop&w=800&q=80',
    hotelId: 'azure-horizon-villa',
  },
  {
    id: 'teal-waters',
    name: 'Teal Waters Resort',
    country: 'Maldives',
    countryKey: 'pages.profile.savedPlaces.tealWaters.country',
    guestRating: 5.0,
    descriptionKey: 'pages.profile.savedPlaces.tealWaters.description',
    imageUrl:
      'https://images.unsplash.com/photo-1573843981267-be1999ffcd2b?auto=format&fit=crop&w=800&q=80',
    hotelId: 'teal-waters-resort',
  },
]
