import { useTranslation } from 'react-i18next'
import { ANALYTICS_I18N } from '../../const'
import { REPORT_CARD_ACCENT_CLASS } from './const'
import styles from './styles.module.css'
import type { ReportCardProps } from './types'

export const ReportCard = ({ report }: ReportCardProps) => {
  const { t } = useTranslation()
  const accentClass =
    styles[REPORT_CARD_ACCENT_CLASS[report.id as keyof typeof REPORT_CARD_ACCENT_CLASS] ?? 'chartCardBooking']

  return (
    <article className={`${styles.chartCard} ${accentClass}`}>
      <h2 className={styles.chartTitle}>{t(report.titleKey)}</h2>
      <p className={styles.chartSubtitle}>{t(report.subtitleKey)}</p>
      {report.requiresAuth && report.items.length === 0 ? (
        <p className={styles.noData}>
          {t(
            report.id === 'revenue'
              ? ANALYTICS_I18N.charts.reports.revenue.loginRequired
              : ANALYTICS_I18N.charts.reports.booking.loginRequired,
          )}
        </p>
      ) : (
        <div className={styles.reportList}>
          {report.items.map((item) => (
            <div key={item.id} className={styles.reportRow}>
              <span className={styles.reportLabel}>{t(item.labelKey)}</span>
              <span className={styles.reportValue}>{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
