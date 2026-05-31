import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { BookingCard } from '@/components/common/BookingCard'
import { BookingsPlannerCta } from '@/components/common/BookingsPlannerCta'
import { CITY_TO_EXPLORATION } from '@/pages/Planner/const'
import { buildPlannerUrl, resolveExplorationFromDestination } from '@/pages/Planner/utils'
import {
  BOOKINGS_I18N,
  BOOKING_TABS,
  MOCK_BOOKINGS,
  STATUS_LABEL_KEYS,
} from './const'
import styles from './styles.module.css'
import type { BookingDisplayStatus, BookingTab } from './types'
import { filterBookingsByTab, formatBookingDateRange } from './utils'

const statusVariantMap: Record<
  BookingDisplayStatus,
  'confirmed' | 'pending' | 'cancelled' | 'completed'
> = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
}

const tabLabelKeys: Record<BookingTab, string> = {
  upcoming: BOOKINGS_I18N.tabs.upcoming,
  past: BOOKINGS_I18N.tabs.past,
  cancelled: BOOKINGS_I18N.tabs.cancelled,
}

const BookingsPage = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<BookingTab>('upcoming')

  const filteredBookings = useMemo(
    () => filterBookingsByTab(MOCK_BOOKINGS, activeTab),
    [activeTab],
  )

  const primaryUpcoming = useMemo(
    () => MOCK_BOOKINGS.find((booking) => booking.tab === 'upcoming'),
    [],
  )

  const handlePlannerNavigate = () => {
    if (!primaryUpcoming) {
      navigate('/planner')
      return
    }
    const cityKey = primaryUpcoming.city.toLowerCase()
    const exploration =
      CITY_TO_EXPLORATION[cityKey] ??
      resolveExplorationFromDestination(primaryUpcoming.country.toLowerCase())
    navigate(
      buildPlannerUrl({
        exploration,
        destination: cityKey,
        dates: `${primaryUpcoming.checkIn},${primaryUpcoming.checkOut}`,
        guests: String(primaryUpcoming.guestCount),
      }),
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t(BOOKINGS_I18N.title)}</h1>

      <div className={styles.tabs} role="tablist" aria-label={t(BOOKINGS_I18N.title)}>
        {BOOKING_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {t(tabLabelKeys[tab])}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <p className={styles.empty}>{t(BOOKINGS_I18N.empty)}</p>
      ) : (
        <div className={styles.list} role="tabpanel">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              hotelName={booking.hotelName}
              location={`${booking.city}, ${booking.country}`}
              datesLabel={t(BOOKINGS_I18N.card.dates)}
              dateRange={formatBookingDateRange(
                booking.checkIn,
                booking.checkOut,
                i18n.language,
              )}
              guestsRoom={t(BOOKINGS_I18N.card.guestsRoom, {
                count: booking.guestCount,
                room: t(booking.roomTypeKey),
              })}
              statusLabel={t(STATUS_LABEL_KEYS[booking.status])}
              statusVariant={statusVariantMap[booking.status]}
              imageUrl={booking.imageUrl}
              getDirectionsLabel={t(BOOKINGS_I18N.card.getDirections)}
              viewDetailsLabel={t(BOOKINGS_I18N.card.viewDetails)}
              onGetDirections={() => {
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${booking.hotelName} ${booking.city}`)}`,
                  '_blank',
                  'noopener,noreferrer',
                )
              }}
              onViewDetails={() => navigate(`/hotel/${booking.hotelId}`)}
            />
          ))}
        </div>
      )}

      <BookingsPlannerCta
        title={t(BOOKINGS_I18N.cta.title)}
        description={t(BOOKINGS_I18N.cta.description)}
        buttonLabel={t(BOOKINGS_I18N.cta.button)}
        onClick={handlePlannerNavigate}
      />
    </div>
  )
}

export default BookingsPage
