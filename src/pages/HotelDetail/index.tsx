import type { Dayjs } from 'dayjs'
import { message, Spin } from 'antd'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { trackDestinationView } from '@/services/analytics'
import { useNavigate, useParams } from 'react-router-dom'

import { HotelDetailHero } from '@/pages/HotelDetail/components/HotelDetailHero'
import { ReviewCard } from '@/components/common/ReviewCard'
import { HotelBookingCard } from '@/components/forms/HotelBookingCard'
import type { HotelBookingFormData } from '@/components/forms/HotelBookingCard/types'

import { formatCurrency } from '@/utils/currency'
import { isForbiddenError } from '@/configs/axios'
import { useCreateBooking } from '@/hooks/useBooking'
import { useHotel, useHotelReviews } from '@/hooks/useHotel'
import { HOTEL_DETAIL_BOOKING_DEFAULTS, HOTEL_DETAIL_I18N } from './const'
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

  const { mutateAsync: createBookingMutation, isPending: isCreatingBooking } = useCreateBooking()

  const [nights, setNights] = useState<number>(HOTEL_DETAIL_BOOKING_DEFAULTS.defaultNights)

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
  const summary = calculateBookingSummary(hotel, nights)
  const locale = i18n.language
  const location = `${hotel.city}, ${hotel.country}`

  const handleDatesChange = (checkIn: Dayjs | null, checkOut: Dayjs | null) => {
    setNights(calculateNights(checkIn, checkOut, hotel.defaultNights))
  }

  const nightsLineLabel = t(HOTEL_DETAIL_I18N.booking.nightsLine, {
    price: formatCurrency(hotel.pricePerNight, 'USD', locale),
    nights: summary.nights,
  })

  // BOOKING

  const handleBookNow = async (formData: HotelBookingFormData) => {
    try {
      await createBookingMutation({
        hotelId: Number(hotel.id),
        checkIn: formData.checkIn.format('YYYY-MM-DD'),
        checkOut: formData.checkOut.format('YYYY-MM-DD'),
        guestCount: formData.guestCount,
        totalPrice: summary.total,
      })
      navigate('/bookings')
    } catch (error) {
      if (!isForbiddenError(error)) {
        message.error(t(HOTEL_DETAIL_I18N.booking.createError))
      }
    }
  }

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
            defaultCheckIn={defaultDates.checkIn}
            defaultCheckOut={defaultDates.checkOut}
            onDatesChange={handleDatesChange}
            onBookNow={handleBookNow}
            isSubmitting={isCreatingBooking}
          />
        </aside>
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
