import ReactGA from 'react-ga4'
import type { Booking } from '@/types/booking'
import { recordAppEvent } from './appEvents'

export const BOOKING_CONFIRMED_PREFIX = 'booking_confirmed|'
export const BOOKING_CANCELLED_PREFIX = 'booking_cancelled|'

export const formatBookingConfirmedLabel = (booking: Booking): string =>
  `${BOOKING_CONFIRMED_PREFIX}${booking.id}|${booking.totalPrice}|${booking.status}|${booking.checkIn}|${booking.checkOut}`

export const formatBookingCancelledLabel = (bookingId: number): string =>
  `${BOOKING_CANCELLED_PREFIX}${bookingId}`

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID

export type TravelItem = {
  item_id: string
  item_name: string
  item_category?: string
  item_category2?: string
  price?: number
  quantity?: number
}

let gaInitialized = false

export const initGA = (): void => {
  if (gaInitialized || !GA_MEASUREMENT_ID) return
  ReactGA.initialize(GA_MEASUREMENT_ID)
  gaInitialized = true
}

export const trackPageView = (path: string, title?: string): void => {
  const normalizedPath = path.split('?')[0] || '/'
  recordAppEvent('page_view', { path: normalizedPath, label: title })
  if (!GA_MEASUREMENT_ID) return
  ReactGA.send({
    hitType: 'pageview',
    page: path,
    title,
  })
}

export const trackSearch = (searchTerm: string): void => {
  recordAppEvent('search', { label: searchTerm })
  if (!GA_MEASUREMENT_ID) return
  ReactGA.event('search', {
    search_term: searchTerm,
  })
}

export const trackDestinationView = (
  item: TravelItem,
  currency: string = 'USD',
): void => {
  recordAppEvent('view_item', {
    path: `/hotel/${item.item_id}`,
    label: item.item_name,
  })
  if (!GA_MEASUREMENT_ID) return
  ReactGA.event('view_item', {
    currency,
    value: item.price ?? 0,
    items: [item],
  })
}

export type SaveFavouriteDetails = Pick<
  TravelItem,
  'item_name' | 'item_category' | 'item_category2' | 'price'
>

export const trackSaveFavourite = (
  hotelId: number,
  details?: SaveFavouriteDetails,
  currency: string = 'USD',
): void => {
  const item: TravelItem = {
    item_id: String(hotelId),
    item_name: details?.item_name ?? String(hotelId),
    item_category: details?.item_category,
    item_category2: details?.item_category2,
    price: details?.price,
  }
  recordAppEvent('custom', {
    path: `/hotel/${hotelId}`,
    label: `save_favourite:${item.item_name}`,
  })
  if (!GA_MEASUREMENT_ID) return
  ReactGA.event('add_to_wishlist', {
    currency,
    value: item.price ?? 0,
    items: [item],
  })
}

export const trackBookingConfirmed = (booking: Booking): void => {
  recordAppEvent('custom', {
    path: '/bookings',
    label: formatBookingConfirmedLabel(booking),
  })
  if (!GA_MEASUREMENT_ID) return
  ReactGA.event('purchase', {
    currency: 'USD',
    value: booking.totalPrice,
    transaction_id: String(booking.id),
  })
}

export const trackBookingCancelled = (bookingId: number): void => {
  recordAppEvent('custom', {
    path: '/bookings',
    label: formatBookingCancelledLabel(bookingId),
  })
}

export const trackAnalyticsExport = (startDate: string, endDate: string): void => {
  recordAppEvent('custom', { label: `analytics_export:${startDate}:${endDate}` })
  if (!GA_MEASUREMENT_ID) return
  ReactGA.event('analytics_export', {
    start_date: startDate,
    end_date: endDate,
  })
}

export const trackAnalyticsDateChange = (startDate: string, endDate: string): void => {
  recordAppEvent('custom', { label: `analytics_date_change:${startDate}:${endDate}` })
  if (!GA_MEASUREMENT_ID) return
  ReactGA.event('analytics_date_change', {
    start_date: startDate,
    end_date: endDate,
  })
}
