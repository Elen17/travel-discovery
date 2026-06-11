import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMyBookings } from '@/pages/Bookings/hooks'
import { getAppEvents } from '@/services/appEvents'
import { useAppSelector } from '@/store/hooks'
import { TRACKED_NAV_ITEMS } from './const'
import { buildDashboardFromEvents } from './buildDashboard'
import type { AnalyticsDateRange } from './types'

export const useAnalyticsDashboard = (dateRange: AnalyticsDateRange) => {
  const { i18n } = useTranslation()
  const [events, setEvents] = useState(() => getAppEvents())
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const { data: bookingsData } = useMyBookings({ enabled: isAuthenticated })

  useEffect(() => {
    const refresh = () => setEvents(getAppEvents())
    window.addEventListener('focus', refresh)
    const intervalId = window.setInterval(refresh, 5000)
    return () => {
      window.removeEventListener('focus', refresh)
      window.clearInterval(intervalId)
    }
  }, [])

  return useMemo(
    () =>
      buildDashboardFromEvents(events, dateRange, TRACKED_NAV_ITEMS, {
        bookings: bookingsData?.content ?? [],
        isAuthenticated,
        locale: i18n.language,
      }),
    [bookingsData?.content, events, dateRange, isAuthenticated, i18n.language],
  )
}
