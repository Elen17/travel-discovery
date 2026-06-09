import type { SidebarFiltersState, StarRatingFilter } from './types'
import { PRICE_RANGE } from './const'
import type { HotelType } from '@/types/hotel'

export const parseFiltersFromParams = (searchParams: URLSearchParams) => ({
  page: Math.max(1, Number(searchParams.get('page') ?? '1')),
  country: searchParams.get('country') ?? undefined,
  countryId: searchParams.get('countryId') ?? null,
  city: searchParams.get('city') ?? undefined,
  minPrice: Number(searchParams.get('minPrice') ?? PRICE_RANGE.min),
  maxPrice: Number(searchParams.get('maxPrice') ?? PRICE_RANGE.max),
  starRating: searchParams.get('starRating')
    ? (Number(searchParams.get('starRating')) as StarRatingFilter)
    : undefined,
  hotelType: (searchParams.get('hotelType') as HotelType) ?? undefined,
})

export const buildSearchParams = (
  applied: SidebarFiltersState,
  priceRange: typeof PRICE_RANGE,
): URLSearchParams => {
  const next = new URLSearchParams()
  if (applied.country) next.set('country', applied.country)
  if (applied.countryId) next.set('countryId', applied.countryId)
  if (applied.city) next.set('city', applied.city)
  if (applied.priceRange[0] !== priceRange.min) next.set('minPrice', String(applied.priceRange[0]))
  if (applied.priceRange[1] !== priceRange.max) next.set('maxPrice', String(applied.priceRange[1]))
  if (applied.starRating) next.set('starRating', String(applied.starRating))
  if (applied.hotelType) next.set('hotelType', applied.hotelType)
  next.set('page', '1')
  return next
}
