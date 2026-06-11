import { useTranslation } from 'react-i18next'
import { ANALYTICS_I18N } from '../../const'
import styles from './styles.module.css'
import type { MenuPageTrafficCardProps } from './types'

export const MenuPageTrafficCard = ({ items }: MenuPageTrafficCardProps) => {
  const { t } = useTranslation()

  return (
    <article className={styles.chartCard}>
      <h2 className={styles.chartTitle}>
        {t(ANALYTICS_I18N.charts.menuPageTraffic.title)}
      </h2>
      <div className={styles.interestList}>
        {items.map((item) => (
          <div key={item.id} className={styles.interestRow}>
            <span className={styles.interestLabel}>{t(item.labelKey)}</span>
            <div className={styles.interestBarTrack}>
              <div
                className={styles.interestBarFill}
                style={{ width: `${item.percent}%` }}
              />
            </div>
            <span className={styles.interestPercent}>{item.percent}%</span>
          </div>
        ))}
      </div>
    </article>
  )
}
