import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { KPI_CARD_ACCENT_CLASS, KPI_SPARKLINE_CLASS } from './const'
import { buildSparklinePath } from './utils'
import styles from './styles.module.css'
import type { KpiCardProps } from './types'

export const KpiCard = ({ metric }: KpiCardProps) => {
  const { t } = useTranslation()
  const accentClass =
    styles[KPI_CARD_ACCENT_CLASS[metric.id as keyof typeof KPI_CARD_ACCENT_CLASS] ?? 'kpiCardVisitors']
  const sparklineClass =
    styles[KPI_SPARKLINE_CLASS[metric.id as keyof typeof KPI_SPARKLINE_CLASS] ?? 'sparklinePrimary']

  const trendClass =
    metric.trend?.direction === 'up'
      ? styles.kpiTrendUp
      : metric.trend?.direction === 'down'
        ? styles.kpiTrendDown
        : styles.kpiTrendSteady

  return (
    <article className={`${styles.kpiCard} ${accentClass}`}>
      <p className={styles.kpiLabel}>{t(metric.labelKey)}</p>
      <div className={styles.kpiValueRow}>
        <p className={styles.kpiValue}>{metric.value}</p>
        {metric.trend ? (
          <span className={`${styles.kpiTrend} ${trendClass}`}>
            {metric.trend.direction === 'up' ? <ArrowUpOutlined /> : null}
            {metric.trend.direction === 'down' ? <ArrowDownOutlined /> : null}
            {metric.trend.label}
          </span>
        ) : null}
        {metric.badgeKey ? <span className={styles.kpiBadge}>{t(metric.badgeKey)}</span> : null}
      </div>
      {metric.sparkline ? (
        <svg
          className={styles.kpiSparkline}
          viewBox="0 0 120 36"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d={buildSparklinePath(metric.sparkline, 120, 36)}
            fill="none"
            className={sparklineClass}
            strokeWidth="2"
          />
        </svg>
      ) : null}
    </article>
  )
}
