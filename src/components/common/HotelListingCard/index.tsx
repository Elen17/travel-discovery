import { EnvironmentOutlined, HeartFilled, HeartOutlined, StarFilled } from '@ant-design/icons'
import { Button } from 'antd'
import type { HotelListingCardProps } from './types'
import styles from './styles.module.css'

export const HotelListingCard = ({
  name,
  location,
  priceLabel,
  perNightLabel,
  guestRating,
  imageUrl,
  isFeatured,
  featuredLabel,
  bookNowLabel,
  saveLabel,
  savedLabel,
  isSaved = false,
  isSaving = false,
  onBookNow,
  onSave,
}: HotelListingCardProps) => {
  const saveButtonClass = isSaved ? `${styles.saveBtn} ${styles.saveBtnActive}` : styles.saveBtn

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={imageUrl} alt={`View of ${name}`} className={styles.image} loading="lazy" />
        {isFeatured ? <span className={styles.featuredBadge}>{featuredLabel}</span> : null}
        <button
          type="button"
          className={saveButtonClass}
          disabled={isSaving}
          onClick={(event) => {
            event.stopPropagation()
            onSave?.()
          }}
          aria-label={isSaved ? (savedLabel ?? saveLabel) : saveLabel}
          aria-pressed={isSaved}
        >
          {isSaved ? <HeartFilled /> : <HeartOutlined />}
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{name}</h3>
          <span className={styles.rating}>
            <StarFilled className={styles.ratingIcon} />
            {guestRating.toFixed(1)}
          </span>
        </div>

        <p className={styles.location}>
          <EnvironmentOutlined />
          {location}
        </p>

        <div className={styles.cardFooter}>
          <span className={styles.price}>
            {priceLabel}
            <span className={styles.priceUnit}> {perNightLabel}</span>
          </span>
          <Button type="primary" className={styles.bookBtn} onClick={onBookNow}>
            {bookNowLabel}
          </Button>
        </div>
      </div>
    </article>
  )
}
