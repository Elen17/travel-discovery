import ReactGA from 'react-ga4'
import { recordAppEvent } from './appEvents'

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
