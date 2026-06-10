import { EnvironmentOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import styles from './styles.module.css'
import type { BookingCardProps } from './types'

const statusClassMap = {
  confirmed: styles.statusConfirmed,
  pending: styles.statusPending,
  cancelled: styles.statusCancelled,
  completed: styles.statusCompleted,
} as const

export const BookingCard = ({
  hotelName,
  location,
  datesLabel,
  dateRange,
  guestsRoom,
  statusLabel,
  statusVariant,
  imageUrl,
  getDirectionsLabel,
  viewDetailsLabel,
  onGetDirections,
  onViewDetails,
}: BookingCardProps) => {
  return (
    <article className={styles.card}>
      <img src={imageUrl} alt="" className={styles.image} loading="lazy" />

      <div className={styles.content}>
        <span className={`${styles.statusBadge} ${statusClassMap[statusVariant]}`}>
          <span className={styles.statusDot} aria-hidden />
          {statusLabel}
        </span>

        <div className={styles.hotelInfo}>
          <h3 className={styles.title}>{hotelName}</h3>
          <p className={styles.location}>
            <EnvironmentOutlined />
            {location}
          </p>
        </div>

        <div className={styles.bookingDetails}>
          <span className={styles.detailLabel}>{datesLabel}</span>
          <span className={styles.detailValue}>{dateRange}</span>
          <span className={styles.occupancy}>{guestsRoom}</span>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.directionsLink} onClick={onGetDirections}>
            {getDirectionsLabel}
          </button>
          <Button className={styles.detailsBtn} onClick={onViewDetails}>
            {viewDetailsLabel}
          </Button>
        </div>
      </div>
    </article>
  )
}
