import { EnvironmentOutlined, StarFilled, SunOutlined } from '@ant-design/icons'
import styles from './styles.module.css'
import type { HotelDetailHeroProps } from './types'

export const HotelDetailHero = ({
  imageUrl,
  name,
  location,
  guestRating,
  reviewCountLabel,
  weatherTemp,
  weatherLabel,
}: HotelDetailHeroProps) => {
  return (
    <section className={styles.hero} aria-label={name}>
      <img src={imageUrl} alt="" className={styles.image} />
      <span className={styles.overlay} aria-hidden />

      <div className={styles.bottomLeft}>
        <div className={styles.ratingRow}>
          {Array.from({ length: 5 }).map((_, i) => (
            <StarFilled key={i} className={styles.stars} />
          ))}
          <span>
            {guestRating.toFixed(1)} ({reviewCountLabel})
          </span>
        </div>
        <h1 className={styles.title}>{name}</h1>
        <p className={styles.location}>
          <EnvironmentOutlined />
          {location}
        </p>
      </div>

      <div className={styles.weather}>
        <SunOutlined className={styles.weatherIcon} />
        <span>
          {weatherTemp}°C {weatherLabel}
        </span>
      </div>
    </section>
  )
}
