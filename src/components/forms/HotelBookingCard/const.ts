import { DEFAULT_GUEST_VALUE, GUEST_OPTIONS, HOTEL_DETAIL_I18N } from '@/pages/HotelDetail/const'

export const DEFAULT_GUEST_SELECTION = DEFAULT_GUEST_VALUE

export const BOOKING_I18N = HOTEL_DETAIL_I18N.booking
export const BOOKING_GUEST_OPTIONS = GUEST_OPTIONS

export const parseGuestCount = (value: string): number => {
  const [adults = '0', children = '0'] = value.split('-')
  return Number(adults) + Number(children)
}
