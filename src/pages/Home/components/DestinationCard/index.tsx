import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import type { KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './styles.module.css'
import type { DestinationCardProps } from './types'

export const DestinationCard = ({
  city,
  country,
  imageUrl,
  avgPriceLabel,
  hotelId,
  isSaved = false,
  isSaving = false,
  onClick,
  onSave,
}: DestinationCardProps) => {
  const { t } = useTranslation()

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onClick?.()
  }

  const saveButtonClass = isSaved ? `${styles.saveBtn} ${styles.saveBtnActive}` : styles.saveBtn

  return (
    <div
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleCardKeyDown}
    >
      <img
        src={imageUrl}
        alt={t('pages.home.trending.cardAlt', { city, country })}
        className={styles.image}
        loading="lazy"
      />
      <span className={styles.overlay} aria-hidden />
      <button
        type="button"
        className={saveButtonClass}
        disabled={isSaving}
        onClick={(e) => {
          e.stopPropagation()
          onSave?.()
        }}
        aria-label={
          isSaved
            ? t('pages.home.trending.savedDestination', { city })
            : t('common.saveDestination')
        }
        aria-pressed={isSaved}
        data-hotel-id={hotelId}
      >
        {isSaved ? <HeartFilled /> : <HeartOutlined />}
      </button>
      <div className={styles.content}>
        <span className={styles.price}>{avgPriceLabel}</span>
        <h3 className={styles.city}>{city}</h3>
        <p className={styles.country}>{country}</p>
      </div>
    </div>
  )
}
