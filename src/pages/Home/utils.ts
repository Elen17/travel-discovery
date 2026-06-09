import { getHotels } from '@/api/hotels'
import type { Hotel, HotelLiveSearchParams } from '@/types/hotel'
import type { HomeSearchBarValues } from './components/HomeSearchBar'
import type { Dayjs } from 'dayjs'
import { TRENDING_HOTELS_LIMIT, TRENDING_MIN_STAR_RATING } from './const'

const shuffleArray = <T>(items: T[]): T[] => {
  const copy = [...items]

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const current = copy[index]
    copy[index] = copy[randomIndex]
    copy[randomIndex] = current
  }

  return copy
}

const getHotelRating = (hotel: Hotel): number => hotel.averageRating ?? hotel.starRating ?? 0

export const fetchTrendingHotels = async (): Promise<Hotel[]> => {
  const response = await getHotels({
    starRating: TRENDING_MIN_STAR_RATING,
    page: 0,
    size: TRENDING_HOTELS_LIMIT,
  })

  const topRatedHotels = [...response.content]
    .sort((left, right) => getHotelRating(right) - getHotelRating(left))
    .slice(0, TRENDING_HOTELS_LIMIT)

  return shuffleArray(topRatedHotels)
}
export const buildHotelLiveSearchParams = (
  values: HomeSearchBarValues,
): HotelLiveSearchParams | null => {
  const country = values.country?.trim()
  const city = values.city?.trim()

  if (!country || !city) {
    return null
  }

  const params: HotelLiveSearchParams = { country, city }

  const dates = values.dates
  if (dates?.[0] && dates[1]) {
    params.checkIn = formatDateParam(dates[0])
    params.checkOut = formatDateParam(dates[1])
  }

  if (values.guests) {
    params.adults = values.guests
  }

  return params
}

export const buildDestinationsSearchParams = (values: HomeSearchBarValues): URLSearchParams => {
  const params = new URLSearchParams()

  if (values.country?.trim()) {
    params.set('country', values.country.trim())
  }

  if (values.city?.trim()) {
    params.set('city', values.city.trim())
  }

  const dates = values.dates
  if (dates?.[0] && dates[1]) {
    params.set('checkIn', formatDateParam(dates[0]))
    params.set('checkOut', formatDateParam(dates[1]))
  }

  if (values.guests) {
    params.set('guests', String(values.guests))
  }

  return params
}

const formatDateParam = (date: Dayjs): string => date.format('YYYY-MM-DD')
