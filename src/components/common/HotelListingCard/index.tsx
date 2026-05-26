import { EnvironmentOutlined, HeartOutlined, StarFilled } from '@ant-design/icons'
import { Button } from 'antd'
import styles from './styles.module.css'
import type { HotelListingCardProps } from './types'

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
  onBookNow,
  onSave,
}: HotelListingCardProps) => {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={imageUrl} alt="" className={styles.image} loading="lazy" />
        {isFeatured ? <span className={styles.featuredBadge}>{featuredLabel}</span> : null}
        <button
          type="button"
          className={styles.saveBtn}
          onClick={onSave}
          aria-label={saveLabel}
        >
          <HeartOutlined />
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

        <div className={styles.footer}>
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
