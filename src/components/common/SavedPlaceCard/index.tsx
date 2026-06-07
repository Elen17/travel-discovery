import { HeartFilled, StarFilled, ThunderboltOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import styles from './styles.module.css'
import type { SavedPlaceCardProps } from './types'

export const SavedPlaceCard = ({
  name,
  country,
  description,
  guestRating,
  imageUrl,
  bookNowLabel,
  planWithAiLabel,
  removeLabel,
  onBookNow,
  onPlanWithAi,
  onRemove,
}: SavedPlaceCardProps) => {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={imageUrl} alt="" className={styles.image} loading="lazy" />
        <span className={styles.countryBadge}>{country}</span>
        <button
          type="button"
          className={`${styles.removeBtn} ${styles.removeBtnActive}`}
          onClick={onRemove}
          aria-label={removeLabel}
          aria-pressed
        >
          <HeartFilled />
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{name}</h3>
          {typeof guestRating === 'number' && Number.isFinite(guestRating) ? (
            <span className={styles.rating}>
              <StarFilled className={styles.ratingIcon} />
              {guestRating.toFixed(1)}
            </span>
          ) : null}
        </div>
        <p className={styles.description}>{description}</p>
        <div className={styles.actions}>
          <Button type="primary" className={styles.bookBtn} onClick={onBookNow}>
            {bookNowLabel}
          </Button>
          <Button className={styles.planBtn} icon={<ThunderboltOutlined />} onClick={onPlanWithAi}>
            {planWithAiLabel}
          </Button>
        </div>
      </div>
    </article>
  )
}
