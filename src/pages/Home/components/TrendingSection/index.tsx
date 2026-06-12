import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useFavouriteSave } from '@/hooks/useFavouriteSave'
import { HOME_I18N, TRENDING_HOTELS_QUERY_KEY } from '@/pages/Home/const'
import { fetchTrendingHotels } from '@/pages/Home/utils'
import { formatCurrency } from '@/utils/currency'
import { DestinationCard } from '../DestinationCard'
import { SectionHeader } from '../SectionHeader'
import styles from './styles.module.css'

export const TrendingSection = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const carouselRef = useRef<HTMLDivElement>(null)
  const { saveFavourite, savedHotelIds, savingHotelId, modals } = useFavouriteSave()

  const {
    data: trendingHotels = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: TRENDING_HOTELS_QUERY_KEY,
    queryFn: fetchTrendingHotels,
  })

  const scrollCarousel = (direction: 'left' | 'right') => {
    const el = carouselRef.current
    if (!el) return

    const firstCard = el.firstElementChild as HTMLElement | null
    const cardWidth = firstCard?.offsetWidth ?? 260
    const gap = 20
    const amount = direction === 'left' ? -(cardWidth + gap) : cardWidth + gap
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  const handleDestinationClick = (hotelId: number, city: string, country: string) => {
    navigate(`/hotel/${hotelId}`, {
      state: { city, country },
    })
  }

  const carouselContent = (() => {
    if (isLoading) {
      return (
        <div className={styles.loading}>
          <Spin aria-label={t('common.loading')} />
        </div>
      )
    }

    if (isError) {
      return <p className={styles.empty}>{t(HOME_I18N.trending.loadError)}</p>
    }

    if (trendingHotels.length === 0) {
      return null
    }

    return (
      <div ref={carouselRef} className={styles.carouselTrack}>
        {trendingHotels.map((hotel) => (
          <DestinationCard
            key={hotel.id}
            hotelId={hotel.id}
            city={hotel.city}
            country={hotel.country}
            imageUrl={hotel.mainImageUrl}
            avgPriceLabel={t(HOME_I18N.trending.avgPrice, {
              price: formatCurrency(hotel.pricePerNight, 'USD', i18n.language),
            })}
            isSaved={savedHotelIds.has(hotel.id)}
            isSaving={savingHotelId === hotel.id}
            onClick={() => handleDestinationClick(hotel.id, hotel.city, hotel.country)}
            onSave={() =>
              void saveFavourite(hotel.id, {
                item_name: hotel.name,
                item_category: hotel.country,
                item_category2: hotel.city,
                price: hotel.pricePerNight,
              })
            }
          />
        ))}
      </div>
    )
  })()

  if (!isLoading && !isError && trendingHotels.length === 0) {
    return null
  }

  return (
    <section className={styles.section} aria-labelledby="trending-heading">
      <SectionHeader
        titleId="trending-heading"
        eyebrow={t(HOME_I18N.trending.eyebrow)}
        title={t(HOME_I18N.trending.title)}
        actions={
          trendingHotels.length > 0 ? (
            <div className={styles.carouselControls}>
              <button
                type="button"
                className={styles.carouselBtn}
                onClick={() => scrollCarousel('left')}
                aria-label={t(HOME_I18N.trending.prev)}
              >
                <LeftOutlined />
              </button>
              <button
                type="button"
                className={styles.carouselBtn}
                onClick={() => scrollCarousel('right')}
                aria-label={t(HOME_I18N.trending.next)}
              >
                <RightOutlined />
              </button>
            </div>
          ) : null
        }
      />
      {carouselContent}
      {modals}
    </section>
  )
}