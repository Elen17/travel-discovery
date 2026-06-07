import type { Dayjs } from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { trackDestinationView } from '@/services/analytics'
import { useNavigate, useParams } from 'react-router-dom'
import { HotelDetailHero } from '@/components/common/HotelDetailHero'
import { ReviewCard } from '@/components/common/ReviewCard'
import { HotelBookingCard } from '@/components/forms/HotelBookingCard'
import { formatCurrency } from '@/utils/currency'
import { HOTEL_DETAIL_I18N } from './const'
import styles from './styles.module.css'
import {
  calculateBookingSummary,
  calculateNights,
  getDefaultDates,
  getHotelDetailById,
} from './utils'

const HotelDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const hotel = getHotelDetailById(id)

  const defaultDates = useMemo(
    () => (hotel ? getDefaultDates(hotel.defaultNights) : null),
    [hotel],
  )

  const [nights, setNights] = useState(hotel?.defaultNights ?? 6)

  useEffect(() => {
    if (!hotel) return
    trackDestinationView({
      item_id: String(hotel.id),
      item_name: hotel.name,
      item_category: hotel.country,
      price: hotel.pricePerNight,
    })
  }, [hotel])

  if (!hotel || !defaultDates) {
    return <p className={styles.notFound}>{t(HOTEL_DETAIL_I18N.notFound)}</p>
  }

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

  return (
    <div className={styles.page} data-hotel-id={hotel.id}>
      <HotelDetailHero
        imageUrl={hotel.heroImageUrl}
        name={hotel.name}
        location={location}
        guestRating={hotel.guestRating}
        reviewCountLabel={t(HOTEL_DETAIL_I18N.reviewsCount, { count: hotel.reviewCount })}
        weatherTemp={hotel.weatherTemp}
        weatherLabel={t(hotel.weatherConditionKey)}
      />

      <div className={styles.layout}>
        <div className={styles.main}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t(hotel.descriptionTitleKey)}</h2>
            <div className={styles.description}>
              {hotel.descriptionParagraphKeys.map((key) => (
                <p key={key}>{t(key)}</p>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t(HOTEL_DETAIL_I18N.amenitiesTitle)}</h2>
            <div className={styles.amenityGrid}>
              {hotel.amenities.map((amenity) => {
                const Icon = amenity.icon
                return (
                  <div key={amenity.id} className={styles.amenityCard}>
                    <span className={styles.amenityIcon}>
                      <Icon />
                    </span>
                    <span className={styles.amenityLabel}>{t(amenity.labelKey)}</span>
                  </div>
                )
              })}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.galleryHeader}>
              <h2 className={styles.sectionTitle}>{t(HOTEL_DETAIL_I18N.galleryTitle)}</h2>
              <a href="#gallery" className={styles.galleryLink}>
                {t(HOTEL_DETAIL_I18N.galleryViewAll, { count: hotel.galleryTotalPhotos })}
              </a>
            </div>
            <div id="gallery" className={styles.galleryGrid}>
              {hotel.gallery.map((image) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt={t(image.altKey)}
                  className={styles.galleryImage}
                  loading="lazy"
                />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.reviewsHeader}>
              <h2 className={styles.sectionTitle}>{t(HOTEL_DETAIL_I18N.reviewsTitle)}</h2>
              <div className={styles.reviewsSummary}>
                <span className={styles.reviewsScore}>{hotel.guestRating.toFixed(1)}</span>
                <span className={styles.reviewsLabel}>
                  {t(HOTEL_DETAIL_I18N.reviewsExceptional)}
                </span>
                <span className={styles.reviewsCount}>
                  {t(HOTEL_DETAIL_I18N.reviewsSummary, { count: hotel.reviewCount })}
                </span>
              </div>
            </div>
            <div className={styles.reviewsGrid}>
              {hotel.reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  initials={review.initials}
                  author={t(review.authorKey)}
                  date={t(review.dateKey)}
                  rating={review.rating}
                  comment={t(review.commentKey)}
                />
              ))}
            </div>
          </section>
        </div>

        <aside className={styles.sidebar}>
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
            onBookNow={() => navigate('/bookings')}
          />
        </aside>
      </div>
    </div>
  )
}

export default HotelDetailPage
