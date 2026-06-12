import { DownloadOutlined } from '@ant-design/icons'
import { Button, DatePicker, Empty } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { trackAnalyticsDateChange, trackAnalyticsExport } from '@/services/analytics'
import { ANALYTICS_I18N, DEFAULT_DATE_RANGE } from './const'
import { useAnalyticsDashboard } from './hooks'
import { fromDateRangeValue, toDateRangeValue } from './dateRangeUtils'
import { exportDashboardCsv } from './exportDashboardCsv'
import { DeviceTypesCard } from './components/DeviceTypesCard'
import { EventBreakdownCard } from './components/EventBreakdownCard'
import { KpiCard } from './components/KpiCard'
import { MenuPageTrafficCard } from './components/MenuPageTrafficCard'
import { ReportCard } from './components/ReportCard'
import { TopDestinationsCard } from './components/TopDestinationsCard'
import type { AnalyticsDateRange } from './types'
import styles from './styles.module.css'

const { RangePicker } = DatePicker

const AnalyticsPage = () => {
  const { t } = useTranslation()
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>({
    start: DEFAULT_DATE_RANGE.start,
    end: DEFAULT_DATE_RANGE.end,
  })

  const dashboardData = useAnalyticsDashboard(dateRange)
  const hasData = dashboardData.totalEvents > 0

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
          <MenuPageTrafficCard items={dashboardData.menuPageTraffic} />

          <EventBreakdownCard
            segments={dashboardData.eventBreakdown}
            totalEvents={dashboardData.totalEvents}
          />
        </div>

        <div className={styles.thirdRow}>
          <TopDestinationsCard items={dashboardData.topDestinations} />

          <DeviceTypesCard devices={dashboardData.deviceTypes} />
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
