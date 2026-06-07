import type { DestinationAmenityFilter, DestinationFilters, DestinationListing } from './types'

const CATEGORY_AMENITY_MAP: Record<string, DestinationAmenityFilter[]> = {
  beaches: ['private-beach'],
  adventure: [],
  'europe-tour': ['infinity-pool'],
  'luxury-tour': ['infinity-pool'],
  'cabin-stays': [],
  'food-wine': [],
}

export const filterListings = (
  listings: DestinationListing[],
  filters: DestinationFilters,
  cityQuery?: string,
  category?: string,
): DestinationListing[] => {
  return listings.filter((listing) => {
    if (category) {
      const requiredAmenities = CATEGORY_AMENITY_MAP[category]
      if (requiredAmenities && requiredAmenities.length > 0) {
        const matchesCategory = requiredAmenities.every((a) => listing.amenities.includes(a))
        if (!matchesCategory) return false
      }
    }

    if (cityQuery) {
      const query = cityQuery.toLowerCase()
      const matchesCity =
        listing.city.toLowerCase().includes(query) ||
        listing.country.toLowerCase().includes(query) ||
        listing.name.toLowerCase().includes(query)
      if (!matchesCity) return false
    }

    if (listing.pricePerNight < filters.minPrice || listing.pricePerNight > filters.maxPrice) {
      return false
    }

    if (filters.minStarRating !== null && listing.starRating < filters.minStarRating) {
      return false
    }

    if (filters.amenityFilters.length > 0) {
      const hasAllAmenities = filters.amenityFilters.every((amenity) =>
        listing.amenities.includes(amenity),
      )
      if (!hasAllAmenities) return false
    }

    return true
  })
}

export const paginateListings = (
  listings: DestinationListing[],
  page: number,
  pageSize: number,
): DestinationListing[] => {
  const start = (page - 1) * pageSize
  return listings.slice(start, start + pageSize)
}
