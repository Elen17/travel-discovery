import type { HomeSearchBarValues } from '@/components/forms/HomeSearchBar'
import type { Dayjs } from 'dayjs'

export const buildDestinationsSearchParams = (values: HomeSearchBarValues): URLSearchParams => {
  const params = new URLSearchParams()

  if (values.destination?.trim()) {
    params.set('city', values.destination.trim())
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
