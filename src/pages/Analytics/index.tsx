import { DownloadOutlined } from '@ant-design/icons'
import { Button, DatePicker, Empty } from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KpiCard } from '@/components/analytics/KpiCard'
import { ReportCard } from '@/components/analytics/ReportCard'
import { trackAnalyticsDateChange, trackAnalyticsExport } from '@/services/analytics'
import { ANALYTICS_I18N, DEFAULT_DATE_RANGE } from './const'
import { useAnalyticsDashboard } from './hooks'
import {
  buildDonutSegments,
  exportDashboardCsv,
  formatCompactCount,
  fromDateRangeValue,
  toDateRangeValue,
} from './utils'
import type { AnalyticsDateRange } from './types'
import styles from './styles.module.css'

const { RangePicker } = DatePicker

const AnalyticsPage = () => {
  const { t, i18n } = useTranslation()
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>({
    start: DEFAULT_DATE_RANGE.start,
    end: DEFAULT_DATE_RANGE.end,
  })

  const dashboardData = useAnalyticsDashboard(dateRange)
  const hasData = dashboardData.totalEvents > 0

  const donutSegments = useMemo(
    () => buildDonutSegments(dashboardData.eventBreakdown),
    [dashboardData.eventBreakdown],
  )

  const deviceDonutSegments = useMemo(
    () =>
      buildDonutSegments(
        dashboardData.deviceTypes
          .filter((device) => device.count > 0)
          .map((device) => ({ percent: device.percent, color: device.color })),
      ),
    [dashboardData.deviceTypes],
  )

  const totalEventsLabel = formatCompactCount(dashboardData.totalEvents, i18n.language)
  const totalDeviceVisitors = dashboardData.deviceTypes.reduce(
    (sum, device) => sum + device.count,
    0,
  )
  const deviceVisitorsLabel = formatCompactCount(totalDeviceVisitors, i18n.language)

  const handleDateChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    const nextRange = fromDateRangeValue(dates)
    if (!nextRange) return
    setDateRange(nextRange)
    trackAnalyticsDateChange(nextRange.start, nextRange.end)
  }

  const disableFutureDates = (date: dayjs.Dayjs) => date.isAfter(dayjs(), 'day')

  const handleExport = () => {
    exportDashboardCsv(dashboardData, dateRange)
    trackAnalyticsExport(dateRange.start, dateRange.end)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>{t(ANALYTICS_I18N.title)}</h1>
          <p className={styles.subtitle}>{t(ANALYTICS_I18N.subtitle)}</p>
        </div>
        <div className={styles.headerActions}>
          <RangePicker
            value={toDateRangeValue(dateRange)}
            onChange={handleDateChange}
            format="MMM DD, YYYY"
            allowClear={false}
            maxDate={dayjs()}
            disabledDate={disableFutureDates}
          />
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
            {t(ANALYTICS_I18N.exportData)}
          </Button>
        </div>
      </header>

      {!hasData ? (
        <Empty
          className={styles.empty}
          description={t(ANALYTICS_I18N.empty)}
        />
      ) : null}

      <section className={styles.dashboard} aria-label={t(ANALYTICS_I18N.title)}>
        <div className={styles.kpiGrid}>
          {dashboardData.kpis.map((metric) => (
            <KpiCard key={metric.id} metric={metric} />
          ))}
        </div>

        <div className={styles.midRow}>
          <article className={styles.chartCard}>
            <h2 className={styles.chartTitle}>
              {t(ANALYTICS_I18N.charts.menuPageTraffic.title)}
            </h2>
            <div className={styles.interestList}>
              {dashboardData.menuPageTraffic.map((item) => (
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
                {dashboardData.eventBreakdown.map((segment) => (
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
        </div>

        <div className={styles.thirdRow}>
          <article className={styles.chartCard}>
            <h2 className={styles.chartTitle}>
              {t(ANALYTICS_I18N.charts.topDestinations.title)}
            </h2>
            <p className={styles.chartSubtitle}>
              {t(ANALYTICS_I18N.charts.topDestinations.subtitle)}
            </p>
            <div className={styles.interestList}>
              {dashboardData.topDestinations.length === 0 ? (
                <p className={styles.noData}>{t(ANALYTICS_I18N.empty)}</p>
              ) : (
                dashboardData.topDestinations.map((item) => (
                  <div key={item.id} className={styles.interestRow}>
                    <span className={styles.interestLabel}>{item.label}</span>
                    <div className={styles.interestBarTrack}>
                      <div
                        className={styles.interestBarFill}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <span className={styles.interestPercent}>{item.percent}%</span>
                  </div>
                ))
              )}
            </div>
          </article>

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
                  {deviceDonutSegments.map((segment, index) => (
                    <path key={index} d={segment.d} fill={segment.color} />
                  ))}
                </svg>
                <div className={styles.donutCenter}>
                  <span className={styles.donutTotalValue}>{deviceVisitorsLabel}</span>
                  <span className={styles.donutTotalLabel}>
                    {t(ANALYTICS_I18N.kpis.totalVisitors)}
                  </span>
                </div>
              </div>
              <div className={styles.demographicsLegend}>
                {dashboardData.deviceTypes
                  .filter((device) => device.count > 0)
                  .map((device) => (
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
        </div>

        <div className={styles.reportsRow}>
          <ReportCard report={dashboardData.bookingReport} />
          <ReportCard report={dashboardData.revenueReport} />
        </div>

      </section>
    </div>
  )
}

export default AnalyticsPage
