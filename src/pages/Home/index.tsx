import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { CategoryCard } from '@/components/common/CategoryCard'
import { DestinationCard } from '@/components/common/DestinationCard'
import { HomeSearchBar } from '@/components/forms/HomeSearchBar'
import type { HomeSearchBarValues } from '@/components/forms/HomeSearchBar'
import { formatCurrency } from '@/utils/currency'
import {
  HERO_IMAGE_URL,
  HOME_CATEGORIES,
  HOME_I18N,
  TRENDING_DESTINATIONS,
} from './const'
import styles from './styles.module.css'
import { buildDestinationsSearchParams } from './utils'

const HomePage = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const carouselRef = useRef<HTMLDivElement>(null)

  const handleSearch = (values: HomeSearchBarValues) => {
    const params = buildDestinationsSearchParams(values)
    const query = params.toString()
    navigate(query ? `/destinations?${query}` : '/destinations')
  }

  const scrollCarousel = (direction: 'left' | 'right') => {
    const el = carouselRef.current
    if (!el) return
    const amount = direction === 'left' ? -280 : 280
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <div className={styles.page}>
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
        aria-label={t(HOME_I18N.heroTitle)}
      >
        <span className={styles.heroOverlay} aria-hidden />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t(HOME_I18N.heroTitle)}</h1>
          <HomeSearchBar onSearch={handleSearch} />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="categories-heading">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderText}>
            <span className={styles.eyebrow}>{t(HOME_I18N.categories.eyebrow)}</span>
            <h2 id="categories-heading" className={styles.sectionTitle}>
              {t(HOME_I18N.categories.title)}
            </h2>
          </div>
        </div>
        <div className={styles.categoryGrid}>
          {HOME_CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              label={t(category.labelKey)}
              icon={category.icon}
              onClick={() => navigate(`/destinations?category=${category.id}`)}
            />
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="trending-heading">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderText}>
            <span className={styles.eyebrow}>{t(HOME_I18N.trending.eyebrow)}</span>
            <h2 id="trending-heading" className={styles.sectionTitle}>
              {t(HOME_I18N.trending.title)}
            </h2>
          </div>
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
        </div>
        <div ref={carouselRef} className={styles.carouselTrack}>
          {TRENDING_DESTINATIONS.map((destination) => (
            <DestinationCard
              key={destination.id}
              city={t(destination.cityKey)}
              country={t(destination.countryKey)}
              imageUrl={destination.imageUrl}
              avgPriceLabel={t(HOME_I18N.trending.avgPrice, {
                price: formatCurrency(destination.avgPrice, 'USD', i18n.language),
              })}
              onClick={() =>
                navigate(`/destinations?city=${encodeURIComponent(destination.cityQuery)}`)
              }
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
