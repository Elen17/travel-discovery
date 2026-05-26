export type ProfilePageProps = Record<string, never>

export type ProfileTab = 'savedPlaces'

export type SavedPlace = {
  id: string
  name: string
  country: string
  countryKey: string
  guestRating: number
  descriptionKey: string
  imageUrl: string
  hotelId: string
}

export type ProfileUserDisplay = {
  fullName: string
  avatarUrl: string
}
