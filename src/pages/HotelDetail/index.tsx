import type { Dayjs } from 'dayjs'
import { message, Spin } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { HotelDetailHero } from '@/pages/HotelDetail/components/HotelDetailHero'
import { MockPaymentModal } from '@/pages/HotelDetail/components/MockPaymentModal'
import { MOCK_PAYMENT_I18N } from '@/pages/HotelDetail/components/MockPaymentModal/const'
import { ReviewCard } from '@/components/common/ReviewCard'
import { HotelBookingCard } from '@/components/forms/HotelBookingCard'
import { parseGuestCount } from '@/components/forms/HotelBookingCard/const'
import type { HotelBookingFormData } from '@/components/forms/HotelBookingCard/types'

import { formatCurrency } from '@/utils/currency'
import { isForbiddenError } from '@/configs/axios'
import { useCreateBooking } from '@/hooks/useBooking'
import {
  getMockPaymentValidationError,
  processMockPayment,
  type MockPaymentDetails,
  type MockPaymentValidationError,
} from '@/services/payment'
import { formatApiFieldErrors, parseApiError } from '@/utils/api'
import {
  notifyAdminBookingCheckoutStarted,
  notifyAdminBookingConfirmed,
} from '@/services/telegram/bookingNotifications'
import { useAppSelector } from '@/store/hooks'
import { useHotel, useHotelReviews } from '@/hooks/useHotel'
import { DEFAULT_GUEST_VALUE, HOTEL_DETAIL_I18N } from './const'
import styles from './styles.module.css'

import {
  calculateBookingSummary,
  calculateNights,
  getDefaultDates,
  mapHotelDetailToPageData,
  mapHotelReviewsToPageData,
} from './utils'

const REVIEWS_PAGE_SIZE = 10

const HotelDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  // API
  const { data: hotelResponse, isLoading: isHotelLoading, isError: isHotelError } = useHotel(id)

  const {
    data: reviewsResponse,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
  } = useHotelReviews(id, 0, REVIEWS_PAGE_SIZE, Boolean(hotelResponse))

  // MAPPED DATA
  const hotel = useMemo(
    () => (hotelResponse ? mapHotelDetailToPageData(hotelResponse) : null),
    [hotelResponse],
  )

  const reviews = useMemo(() => {
    if (!reviewsResponse) return []
    return mapHotelReviewsToPageData(
      reviewsResponse.content,
      (userId) => t(HOTEL_DETAIL_I18N.reviews.guest, { id: userId }),
      i18n.language,
    )
  }, [reviewsResponse, t, i18n.language])

  const defaultDates = useMemo(() => (hotel ? getDefaultDates(hotel.defaultNights) : null), [hotel])

  // DESCRIPTION
  const description = useMemo(() => {
    return {
      title: t('pages.hotelDetail.descriptions.default.title'),
      paragraphs: t('pages.hotelDetail.descriptions.default.paragraphs', {
        returnObjects: true,
      }) as string[],
    }
  }, [t])

  const authUser = useAppSelector((state) => state.auth.user)
  const { mutateAsync: createBookingMutation, isPending: isCreatingBooking } = useCreateBooking()

  const [checkIn, setCheckIn] = useState<Dayjs | null>(null)
  const [checkOut, setCheckOut] = useState<Dayjs | null>(null)
  const [guestSelection, setGuestSelection] = useState(DEFAULT_GUEST_VALUE)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [pendingBooking, setPendingBooking] = useState<HotelBookingFormData | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentBookingError, setPaymentBookingError] = useState<string | null>(null)

  useEffect(() => {
    if (defaultDates) {
      setCheckIn(defaultDates.checkIn)
      setCheckOut(defaultDates.checkOut)
      setGuestSelection(DEFAULT_GUEST_VALUE)
    }
  }, [defaultDates, id])

  // LOADING
  if (isHotelLoading) {
    return (
      <div className={styles.notFound}>
        <Spin size="large" />
      </div>
    )
  }

  // ERROR
  if (isHotelError || !hotel || !defaultDates) {
    return (
      <p className={styles.notFound}>
        {t(isHotelError ? HOTEL_DETAIL_I18N.loadError : HOTEL_DETAIL_I18N.notFound)}
      </p>
    )
  }

  // CALCULATIONS
  const activeCheckIn = checkIn ?? defaultDates.checkIn
  const activeCheckOut = checkOut ?? defaultDates.checkOut
  const guestCount = parseGuestCount(guestSelection)
  const nights = calculateNights(activeCheckIn, activeCheckOut, hotel.defaultNights)
  const summary = calculateBookingSummary(hotel, nights, guestCount)
  const paymentSummary = pendingBooking
    ? calculateBookingSummary(
        hotel,
        calculateNights(pendingBooking.checkIn, pendingBooking.checkOut, hotel.defaultNights),
        pendingBooking.guestCount,
      )
    : summary
  const locale = i18n.language
  const location = `${hotel.city}, ${hotel.country}`

  const handleCheckInChange = (date: Dayjs | null) => {
    if (!date) {
      return
    }

    setCheckIn(date)
    setCheckOut((current) => {
      if (!current || !current.isAfter(date, 'day')) {
        return date.add(hotel.defaultNights, 'day')
      }
      return current
    })
  }

  const handleCheckOutChange = (date: Dayjs | null) => {
    if (!date || !date.isAfter(activeCheckIn, 'day')) {
      return
    }

    setCheckOut(date)
  }

  const handleGuestsChange = (selection: string) => {
    setGuestSelection(selection)
  }

  const resolveBookingTotal = (formData: HotelBookingFormData): number =>
    calculateBookingSummary(
      hotel,
      calculateNights(formData.checkIn, formData.checkOut, hotel.defaultNights),
      formData.guestCount,
    ).total

  const nightsLineLabel = t(HOTEL_DETAIL_I18N.booking.nightsLine, {
    price: formatCurrency(summary.nightlyRate, 'USD', locale),
    nights: summary.nights,
  })

  // BOOKING

  const handleBookNow = (formData: HotelBookingFormData) => {
    setPaymentBookingError(null)
    setPendingBooking(formData)
    setPaymentOpen(true)

    notifyAdminBookingCheckoutStarted(
      {
        hotelName: hotel.name,
        hotelLocation: location,
        checkIn: formData.checkIn.format('YYYY-MM-DD'),
        checkOut: formData.checkOut.format('YYYY-MM-DD'),
        guestCount: formData.guestCount,
        totalPrice: resolveBookingTotal(formData),
      },
      authUser,
      locale,
    )
  }

  const handlePaymentCancel = () => {
    if (isProcessingPayment || isCreatingBooking) {
      return
    }
    setPaymentOpen(false)
    setPendingBooking(null)
    setPaymentBookingError(null)
  }

  const isMockPaymentValidationError = (error: unknown): error is MockPaymentValidationError =>
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'field' in error &&
    typeof (error as MockPaymentValidationError).code === 'string'

  const handlePaymentSubmit = async (paymentDetails: MockPaymentDetails) => {
    if (!pendingBooking) {
      return
    }

    const paymentValidation = getMockPaymentValidationError(paymentDetails)
    if (paymentValidation) {
      return
    }

    setPaymentBookingError(null)
    setIsProcessingPayment(true)
    try {
      await processMockPayment(paymentDetails, paymentSummary.total)
      const booking = await createBookingMutation({
        hotelId: Number(hotel.id),
        checkIn: pendingBooking.checkIn.format('YYYY-MM-DD'),
        checkOut: pendingBooking.checkOut.format('YYYY-MM-DD'),
        guestCount: pendingBooking.guestCount,
        totalPrice: paymentSummary.total,
      })
      notifyAdminBookingConfirmed(
        {
          hotelName: hotel.name,
          hotelLocation: location,
          checkIn: pendingBooking.checkIn.format('YYYY-MM-DD'),
          checkOut: pendingBooking.checkOut.format('YYYY-MM-DD'),
          guestCount: pendingBooking.guestCount,
          totalPrice: paymentSummary.total,
        },
        authUser,
        booking.id,
        locale,
      )
      setPaymentOpen(false)
      setPendingBooking(null)
      setPaymentBookingError(null)
      navigate('/bookings')
    } catch (error) {
      if (isForbiddenError(error)) {
        return
      }

      if (isMockPaymentValidationError(error)) {
        message.error(t(MOCK_PAYMENT_I18N.paymentError))
        return
      }

      const parsed = parseApiError(error, t(MOCK_PAYMENT_I18N.paymentError))
      if (parsed.fieldErrors && Object.keys(parsed.fieldErrors).length > 0) {
        setPaymentBookingError(formatApiFieldErrors(parsed.fieldErrors))
        return
      }

      setPaymentBookingError(parsed.message || t(MOCK_PAYMENT_I18N.bookingValidationError))
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const isBookingBusy = isProcessingPayment || isCreatingBooking

  return (
    <div className={styles.page} data-hotel-id={hotel.id}>
      <HotelDetailHero
        imageUrl={hotel.heroImageUrl}
        name={hotel.name}
        location={location}
        guestRating={hotel.guestRating}
        reviewCountLabel={t(HOTEL_DETAIL_I18N.reviewsCount, {
          count: hotel.reviewCount,
        })}
        weatherTemp={hotel.weatherTemp}
        weatherLabel={t(hotel.weatherConditionKey)}
        latitude={hotel.latitude}
        longitude={hotel.longitude}
      />

      <div className={styles.introRow}>
        {/* DESCRIPTION */}
        <section className={styles.descriptionSection}>
          <h2 className={styles.sectionTitle}>{description.title}</h2>

          <div className={styles.description}>
            <p>{description.paragraphs}</p>
          </div>
        </section>

        {/* BOOKING */}
        <aside className={styles.bookingAside}>
          <HotelBookingCard
            pricePerNight={hotel.pricePerNight}
            priceLabel={formatCurrency(hotel.pricePerNight, 'USD', locale)}
            // priceLabel={formatCurrency(hotel.pricePerNight, 'USD', locale)}
            perNightLabel={t(HOTEL_DETAIL_I18N.booking.perNight)}
            nights={summary.nights}
            subtotal={summary.subtotal}
            serviceFee={summary.serviceFee}
            taxes={summary.taxes}
            total={summary.total}
            formattedSubtotal={formatCurrency(summary.subtotal, 'USD', locale)}
            formattedServiceFee={formatCurrency(summary.serviceFee, 'USD', locale)}
            formattedTaxes={formatCurrency(summary.taxes, 'USD', locale)}
            formattedTotal={formatCurrency(summary.total, 'USD', locale)}
            nightsLineLabel={nightsLineLabel}
            checkIn={activeCheckIn}
            checkOut={activeCheckOut}
            guestSelection={guestSelection}
            onCheckInChange={handleCheckInChange}
            onCheckOutChange={handleCheckOutChange}
            onGuestsChange={handleGuestsChange}
            onBookNow={handleBookNow}
            isSubmitting={isBookingBusy}
          />
        </aside>

        <MockPaymentModal
          open={paymentOpen}
          title={t(MOCK_PAYMENT_I18N.title)}
          amountLabel={t(MOCK_PAYMENT_I18N.amount)}
          totalLabel={formatCurrency(paymentSummary.total, 'USD', locale)}
          cardNameLabel={t(MOCK_PAYMENT_I18N.cardName)}
          cardHolderLabel={t(MOCK_PAYMENT_I18N.cardHolder)}
          cvvLabel={t(MOCK_PAYMENT_I18N.cvv)}
          cardNameRequired={t(MOCK_PAYMENT_I18N.cardNameRequired)}
          cardNameInvalid={t(MOCK_PAYMENT_I18N.cardNameInvalid)}
          cardHolderRequired={t(MOCK_PAYMENT_I18N.cardHolderRequired)}
          cardHolderInvalid={t(MOCK_PAYMENT_I18N.cardHolderInvalid)}
          cvvRequired={t(MOCK_PAYMENT_I18N.cvvRequired)}
          cvvInvalid={t(MOCK_PAYMENT_I18N.cvvInvalid)}
          cancelLabel={t(MOCK_PAYMENT_I18N.cancel)}
          payLabel={t(MOCK_PAYMENT_I18N.pay)}
          bookingError={paymentBookingError}
          isSubmitting={isBookingBusy}
          onCancel={handlePaymentCancel}
          onSubmit={(details) => void handlePaymentSubmit(details)}
        />
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        {/* AMENITIES */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t(HOTEL_DETAIL_I18N.amenitiesTitle)}</h2>

          <div className={styles.amenityGrid}>
            {hotel.amenities.map((amenity) => {
              const Icon = amenity.icon
              const label = amenity.labelKey ? t(amenity.labelKey) : amenity.label

              return (
                <div key={amenity.id} className={styles.amenityCard}>
                  <span className={styles.amenityIcon}>
                    <Icon />
                  </span>
                  <span className={styles.amenityLabel}>{label}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* GALLERY */}
        <section className={styles.section}>
          <div className={styles.galleryHeader}>
            <h2 className={styles.sectionTitle}>{t(HOTEL_DETAIL_I18N.galleryTitle)}</h2>

            <a href="#gallery" className={styles.galleryLink}>
              {t(HOTEL_DETAIL_I18N.galleryViewAll, {
                count: hotel.galleryTotalPhotos,
              })}
            </a>
          </div>

          <div id="gallery" className={styles.galleryGrid}>
            {hotel.gallery.map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt={t(image.altKey, { name: hotel.name })}
                className={styles.galleryImage}
                loading="lazy"
              />
            ))}
          </div>
        </section>

        {/* REVIEWS */}
        <section className={styles.section}>
          <div className={styles.reviewsHeader}>
            <h2 className={styles.sectionTitle}>{t(HOTEL_DETAIL_I18N.reviewsTitle)}</h2>

            <div className={styles.reviewsSummary}>
              <div className={styles.reviewsScoreRow}>
                <span className={styles.reviewsScore}>{hotel.guestRating.toFixed(1)}</span>
                <span className={styles.reviewsLabel}>
                  {t(HOTEL_DETAIL_I18N.reviewsExceptional)}
                </span>
              </div>

              <span className={styles.reviewsCount}>
                {t(HOTEL_DETAIL_I18N.reviewsSummary, {
                  count: hotel.reviewCount,
                })}
              </span>
            </div>
          </div>

          {isReviewsLoading ? (
            <div className={styles.notFound}>
              <Spin />
            </div>
          ) : isReviewsError ? (
            <p className={styles.notFound}>{t(HOTEL_DETAIL_I18N.loadError)}</p>
          ) : (
            <div className={styles.reviewsGrid}>
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  initials={review.initials}
                  author={review.author}
                  date={review.date}
                  rating={review.rating}
                  comment={review.comment}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default HotelDetailPage
