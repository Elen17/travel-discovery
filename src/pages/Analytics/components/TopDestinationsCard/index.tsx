import { useTranslation } from 'react-i18next'
import { ANALYTICS_BAR_VARIANTS, ANALYTICS_I18N } from '../../const'
import styles from './styles.module.css'
import type { TopDestinationsCardProps } from './types'

export const TopDestinationsCard = ({ items }: TopDestinationsCardProps) => {
  const { t } = useTranslation()

  return (
    <article className={`${styles.chartCard} ${styles.chartCardDestinations}`}>
      <h2 className={styles.chartTitle}>
        {t(ANALYTICS_I18N.charts.topDestinations.title)}
      </h2>
      <p className={styles.chartSubtitle}>
        {t(ANALYTICS_I18N.charts.topDestinations.subtitle)}
      </p>
      <div className={styles.interestList}>
        {items.length === 0 ? (
          <p className={styles.noData}>{t(ANALYTICS_I18N.empty)}</p>
        ) : (
          items.map((item, index) => {
            const barClass =
              styles[ANALYTICS_BAR_VARIANTS[index % ANALYTICS_BAR_VARIANTS.length] ?? 'barPrimary']

            return (
              <div key={item.id} className={styles.interestRow}>
                <span className={styles.interestLabel}>{item.label}</span>
                <div className={styles.interestBarTrack}>
                  <div
                    className={`${styles.interestBarFill} ${barClass}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <span className={styles.interestPercent}>{item.percent}%</span>
              </div>
            )
          })
        )}
      </div>
    </article>
  )
}
