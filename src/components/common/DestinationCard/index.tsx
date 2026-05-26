import { HeartOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import styles from './styles.module.css'
import type { DestinationCardProps } from './types'

export const DestinationCard = ({
  city,
  country,
  imageUrl,
  avgPriceLabel,
  onClick,
  onSave,
}: DestinationCardProps) => {
  const { t } = useTranslation()

  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <img src={imageUrl} alt="" className={styles.image} loading="lazy" />
      <span className={styles.overlay} aria-hidden />
      <button
        type="button"
        className={styles.saveBtn}
        onClick={(e) => {
          e.stopPropagation()
          onSave?.()
        }}
        aria-label={t('common.saveDestination')}
      >
        <HeartOutlined />
      </button>
      <div className={styles.content}>
        <span className={styles.price}>{avgPriceLabel}</span>
        <h3 className={styles.city}>{city}</h3>
        <p className={styles.country}>{country}</p>
      </div>
    </button>
  )
}
