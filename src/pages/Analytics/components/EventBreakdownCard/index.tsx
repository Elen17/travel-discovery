import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ANALYTICS_I18N } from '../../const'
import { buildDonutSegments, formatCompactCount } from '../../chartUtils'
import styles from './styles.module.css'
import type { EventBreakdownCardProps } from './types'

export const EventBreakdownCard = ({ segments, totalEvents }: EventBreakdownCardProps) => {
  const { t, i18n } = useTranslation()

  const donutSegments = useMemo(() => buildDonutSegments(segments), [segments])
  const totalEventsLabel = formatCompactCount(totalEvents, i18n.language)

  return (
    <article className={styles.chartCard}>
      <h2 className={styles.chartTitle}>
        {t(ANALYTICS_I18N.charts.eventBreakdown.title)}
      </h2>
      <div className={styles.demographicsBody}>
        <div className={styles.donutWrap}>
          <svg className={styles.donutChart} viewBox="0 0 100 100" aria-hidden>
            {donutSegments.map((segment, index) => (
              <path key={index} d={segment.d} fill={segment.color} />
            ))}
          </svg>
          <div className={styles.donutCenter}>
            <span className={styles.donutTotalValue}>{totalEventsLabel}</span>
            <span className={styles.donutTotalLabel}>
              {t(ANALYTICS_I18N.charts.eventBreakdown.total)}
            </span>
          </div>
        </div>
        <div className={styles.demographicsLegend}>
          {segments.map((segment) => (
            <div key={segment.id} className={styles.demographicLegendItem}>
              <span className={styles.demographicLegendLeft}>
                <span
                  className={styles.demographicSwatch}
                  style={{ background: segment.color }}
                />
                {t(segment.labelKey)}
              </span>
              <span className={styles.demographicPercent}>{segment.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
