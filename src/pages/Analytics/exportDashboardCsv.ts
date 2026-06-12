import type { AnalyticsDashboardData, AnalyticsDateRange } from './types'

export const exportDashboardCsv = (
  data: AnalyticsDashboardData,
  range: AnalyticsDateRange,
): void => {
  const rows = [
    ['Metric', 'Value'],
    ...data.kpis.map((kpi) => [kpi.id, kpi.value]),
    [],
    ['Day', 'Current Period', 'Previous Period'],
    ...data.pageViewTrends.map((point) => [
      point.label,
      String(point.current),
      String(point.previous),
    ]),
    [],
    ['Menu Page', 'Views', 'Share %'],
    ...data.menuPageTraffic.map((item) => [
      item.id,
      String(item.count),
      String(item.percent),
    ]),
    [],
    ['Event Type', 'Count', 'Share %'],
    ...data.eventBreakdown.map((item) => [
      item.id,
      String(item.count),
      String(item.percent),
    ]),
    [],
    ['Destination', 'Interactions', 'Share %'],
    ...data.topDestinations.map((item) => [
      item.label,
      String(item.count),
      String(item.percent),
    ]),
    [],
    ['Device', 'Visitors', 'Share %'],
    ...data.deviceTypes.map((item) => [item.id, String(item.count), String(item.percent)]),
    [],
    ['Booking Report', 'Value'],
    ...data.bookingReport.items.map((item) => [item.id, item.value]),
    [],
    ['Revenue Report', 'Value'],
    ...data.revenueReport.items.map((item) => [item.id, item.value]),
    [],
    ['User Report', 'Value'],
    ...data.userReport.items.map((item) => [item.id, item.value]),
    [],
    ['Recent Event', 'Path', 'Minutes Ago'],
    ...data.recentEvents.map((event) => [
      event.id,
      event.path,
      String(event.minutesAgo),
    ]),
    [],
    ['Date Range', `${range.start} — ${range.end}`],
  ]

  const escapeCsvCell = (cell: string) =>
    /[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell

  const csv = rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `analytics-export-${range.start}-${range.end}.csv`
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
