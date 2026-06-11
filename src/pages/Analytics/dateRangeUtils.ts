import dayjs, { type Dayjs } from 'dayjs'
import type { AppEvent } from '@/services/appEvents'
import type { AnalyticsDateRange } from './types'

export const toDateRangeValue = (range: AnalyticsDateRange): [Dayjs, Dayjs] => [
  dayjs(range.start),
  dayjs(range.end),
]

export const fromDateRangeValue = (
  dates: [Dayjs | null, Dayjs | null] | null,
): AnalyticsDateRange | null => {
  const startDate = dates?.[0]
  const endDate = dates?.[1]
  if (!startDate || !endDate) return null
  const [first, second] = startDate.isAfter(endDate)
    ? [endDate, startDate]
    : [startDate, endDate]
  return {
    start: first.format('YYYY-MM-DD'),
    end: second.format('YYYY-MM-DD'),
  }
}

export const isInRange = (timestamp: string, start: Dayjs, end: Dayjs): boolean => {
  const date = dayjs(timestamp)
  return (
    date.isAfter(start.subtract(1, 'day'), 'day') && date.isBefore(end.add(1, 'day'), 'day')
  )
}

export const filterByRange = (events: AppEvent[], range: AnalyticsDateRange): AppEvent[] => {
  const start = dayjs(range.start).startOf('day')
  const end = dayjs(range.end).endOf('day')
  return events.filter((event) => isInRange(event.timestamp, start, end))
}

export const getPreviousRange = (range: AnalyticsDateRange): AnalyticsDateRange => {
  const start = dayjs(range.start)
  const end = dayjs(range.end)
  const days = end.diff(start, 'day') + 1
  const prevEnd = start.subtract(1, 'day')
  const prevStart = prevEnd.subtract(days - 1, 'day')
  return {
    start: prevStart.format('YYYY-MM-DD'),
    end: prevEnd.format('YYYY-MM-DD'),
  }
}
