import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ANALYTICS_I18N } from '../../const'
import { buildDonutSegments, formatCompactCount } from '../../chartUtils'
import styles from './styles.module.css'
import type { DeviceTypesCardProps } from './types'

export const DeviceTypesCard = ({ devices }: DeviceTypesCardProps) => {
  const { t, i18n } = useTranslation()

  const activeDevices = useMemo(
    () => devices.filter((device) => device.count > 0),
    [devices],
  )

  const donutSegments = useMemo(
    () =>
      buildDonutSegments(
        activeDevices.map((device) => ({ percent: device.percent, color: device.color })),
      ),
    [activeDevices],
  )

  const totalVisitors = useMemo(
    () => activeDevices.reduce((sum, device) => sum + device.count, 0),
    [activeDevices],
  )

  const totalVisitorsLabel = formatCompactCount(totalVisitors, i18n.language)

  return (
    <article className={styles.chartCard}>
      <h2 className={styles.chartTitle}>
        {t(ANALYTICS_I18N.charts.deviceTypes.title)}
      </h2>
      <p className={styles.chartSubtitle}>
        {t(ANALYTICS_I18N.charts.deviceTypes.subtitle)}
      </p>
      <div className={styles.demographicsBody}>
        <div className={styles.donutWrap}>
          <svg className={styles.donutChart} viewBox="0 0 100 100" aria-hidden>
            {donutSegments.map((segment, index) => (
              <path key={index} d={segment.d} fill={segment.color} />
            ))}
          </svg>
          <div className={styles.donutCenter}>
            <span className={styles.donutTotalValue}>{totalVisitorsLabel}</span>
            <span className={styles.donutTotalLabel}>
              {t(ANALYTICS_I18N.kpis.totalVisitors)}
            </span>
          </div>
        </div>
        <div className={styles.demographicsLegend}>
          {activeDevices.map((device) => (
            <div key={device.id} className={styles.demographicLegendItem}>
              <span className={styles.demographicLegendLeft}>
                <span
                  className={styles.demographicSwatch}
                  style={{ background: device.color }}
                />
                {t(device.labelKey)}
              </span>
              <span className={styles.demographicPercent}>{device.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
