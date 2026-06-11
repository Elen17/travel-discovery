import { Alert, Modal, Skeleton, message } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { BookingCard } from '@/components/common/BookingCard'
import { BookingsPlannerCta } from '@/components/common/BookingsPlannerCta'
import { CITY_TO_EXPLORATION } from '@/pages/Planner/const'
import { buildPlannerUrl, resolveExplorationFromDestination } from '@/pages/Planner/utils'
import { notifyAdminBookingCancelled } from '@/services/telegram/bookingNotifications'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setRecentBookings } from '@/store/bookingSlice'
import {
  filterBookingsByTab,
  formatBookingDateRange,
  mapBookingsToDisplay,
} from './utils'
import { BookingTabs } from './components/BookingTabs'
import { BOOKINGS_I18N, STATUS_LABEL_KEYS } from './const'
import { useBookingHotels, useCancelBooking, useMyBookings } from './hooks'
import type { BookingDisplayStatus, BookingTab } from './types'
import type { HotelDetail } from '@/types/hotel'
import styles from './styles.module.css'

const statusVariantMap: Record<
  BookingDisplayStatus,
  'confirmed' | 'pending' | 'cancelled' | 'completed'
> = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
}

const BookingsPage = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [activeTab, setActiveTab] = useState<BookingTab>('upcoming')
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const authUser = useAppSelector((state) => state.auth.user)
  const recentBookings = useAppSelector((state) => state.booking.recentBookings)

  const { data, isLoading, isError } = useMyBookings()
  const { mutateAsync: cancelBookingMutation } = useCancelBooking()

  useEffect(() => {
    if (data?.content) {
      dispatch(setRecentBookings(data.content))
    }
  }, [dispatch, data])

  const hotelIds = useMemo(
    () => [...new Set(recentBookings.map((booking) => booking.hotelId))],
    [recentBookings],
  )

  const hotelQueries = useBookingHotels(hotelIds)

  const hotelsById = useMemo(() => {
    const map = new Map<number, HotelDetail>()
    hotelQueries.forEach((query, index) => {
      if (query.data) {
        map.set(hotelIds[index], query.data)
      }
    })
    return map
  }, [hotelIds, hotelQueries])

  const allBookings = useMemo(
    () => mapBookingsToDisplay(recentBookings, hotelsById),
    [hotelsById, recentBookings],
  )

  const filteredBookings = useMemo(
    () => filterBookingsByTab(allBookings, activeTab),
    [allBookings, activeTab],
  )

  const primaryUpcoming = useMemo(
    () => allBookings.find((booking) => booking.tab === 'upcoming'),
    [allBookings],
  )

  const handleCancelBooking = (bookingId: string) => {
    Modal.confirm({
      title: t(BOOKINGS_I18N.cancelConfirm.title),
      content: t(BOOKINGS_I18N.cancelConfirm.message),
      okText: t(BOOKINGS_I18N.cancelConfirm.ok),
      cancelText: t(BOOKINGS_I18N.cancelConfirm.dismiss),
      okButtonProps: { danger: true },
      onOk: async () => {
        const bookingRecord = recentBookings.find((item) => String(item.id) === bookingId)
        const bookingDisplay = allBookings.find((item) => item.id === bookingId)
        setCancellingId(bookingId)
        try {
          await cancelBookingMutation(Number(bookingId))
          if (bookingRecord && bookingDisplay) {
            notifyAdminBookingCancelled(
              {
                hotelName: bookingDisplay.hotelName,
                hotelLocation: `${bookingDisplay.city}, ${bookingDisplay.country}`,
                checkIn: bookingRecord.checkIn,
                checkOut: bookingRecord.checkOut,
                guestCount: bookingRecord.guestCount,
                totalPrice: bookingRecord.totalPrice,
              },
              authUser,
              bookingRecord.id,
              i18n.language,
            )
          }
          message.success(t(BOOKINGS_I18N.cancelSuccess))
        } catch {
          message.error(t(BOOKINGS_I18N.cancelError))
        } finally {
          setCancellingId(null)
        }
      },
    })
  }

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

  const showLoading = isLoading && recentBookings.length === 0

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t(BOOKINGS_I18N.title)}</h1>

      {isError ? (
        <Alert
          type="warning"
          showIcon
          title={t(BOOKINGS_I18N.loadError)}
          className={styles.alert}
        />
      ) : null}

      <BookingTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {showLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : filteredBookings.length === 0 ? (
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
              {...(booking.tab === 'upcoming'
                ? {
                    cancelLabel: t(BOOKINGS_I18N.card.cancel),
                    isCancelling: cancellingId === booking.id,
                    onCancel: () => handleCancelBooking(booking.id),
                  }
                : {})}
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
