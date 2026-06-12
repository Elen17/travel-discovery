import { useTranslation } from 'react-i18next'
import { ANALYTICS_BAR_VARIANTS, ANALYTICS_I18N } from '../../const'
import styles from './styles.module.css'
import type { MenuPageTrafficCardProps } from './types'

export const MenuPageTrafficCard = ({ items }: MenuPageTrafficCardProps) => {
  const { t } = useTranslation()

  return (
    <article className={`${styles.chartCard} ${styles.chartCardTraffic}`}>
      <h2 className={styles.chartTitle}>
        {t(ANALYTICS_I18N.charts.menuPageTraffic.title)}
      </h2>
      <div className={styles.interestList}>
        {items.map((item, index) => {
          const barClass =
            styles[ANALYTICS_BAR_VARIANTS[index % ANALYTICS_BAR_VARIANTS.length] ?? 'barPrimary']

          return (
            <div key={item.id} className={styles.interestRow}>
              <span className={styles.interestLabel}>{t(item.labelKey)}</span>
              <div className={styles.interestBarTrack}>
                <div
                  className={`${styles.interestBarFill} ${barClass}`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
              <span className={styles.interestPercent}>{item.percent}%</span>
            </div>
          )
        })}
      </div>
    </article>
  )
}
