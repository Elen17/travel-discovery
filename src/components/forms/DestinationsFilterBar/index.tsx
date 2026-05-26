import { EnvironmentOutlined } from '@ant-design/icons'
import { Button, Slider, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { AMENITY_FILTERS } from '@/pages/Destinations/const'
import type { DestinationAmenityFilter } from '@/pages/Destinations/types'
import {
  FILTER_AMENITY_I18N,
  FILTER_I18N,
  FILTER_PRICE_RANGE,
  FILTER_STAR_RATINGS,
} from './const'
import styles from './styles.module.css'
import type { DestinationsFilterBarProps } from './types'

export const DestinationsFilterBar = ({
  priceRange,
  selectedStarRating,
  selectedAmenities,
  onPriceChange,
  onStarRatingChange,
  onAmenityToggle,
  onMapViewClick,
}: DestinationsFilterBarProps) => {
  const { t } = useTranslation()

  const handleStarClick = (rating: number) => {
    onStarRatingChange(selectedStarRating === rating ? null : rating)
  }

  const isAmenityActive = (amenity: DestinationAmenityFilter) =>
    selectedAmenities.includes(amenity)

  return (
    <div className={styles.filterBar}>
      <div className={styles.sectionWide}>
        <span className={styles.label}>{t(FILTER_I18N.priceRange)}</span>
        <Slider
          range
          min={FILTER_PRICE_RANGE.min}
          max={FILTER_PRICE_RANGE.max}
          value={priceRange}
          onChange={(value) => onPriceChange(value as [number, number])}
          tooltip={{ formatter: (value) => `$${value}` }}
        />
        <div className={styles.priceValues}>
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.label}>{t(FILTER_I18N.starRating)}</span>
        <div className={styles.starRow}>
          {FILTER_STAR_RATINGS.map((rating) => (
            <button
              key={rating}
              type="button"
              className={`${styles.starBtn} ${selectedStarRating === rating ? styles.starBtnActive : ''}`}
              onClick={() => handleStarClick(rating)}
              aria-pressed={selectedStarRating === rating}
            >
              {rating}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.sectionWide}>
        <span className={styles.label}>{t(FILTER_I18N.topFilters)}</span>
        <div className={styles.tagRow}>
          {AMENITY_FILTERS.map((amenity) => (
            <Tag
              key={amenity}
              className={`${styles.tag} ${isAmenityActive(amenity) ? styles.tagActive : styles.tagInactive}`}
              onClick={() => onAmenityToggle(amenity)}
            >
              {t(FILTER_AMENITY_I18N[amenity])}
            </Tag>
          ))}
        </div>
      </div>

      <div className={styles.mapSection}>
        <Button
          className={styles.mapBtn}
          icon={<EnvironmentOutlined />}
          onClick={onMapViewClick}
        >
          {t(FILTER_I18N.mapView)}
        </Button>
      </div>
    </div>
  )
}
