import dayjs, { type Dayjs } from 'dayjs'
import type { AppEvent } from '@/services/appEvents'
import { isInRange } from './dateRangeUtils'
import type { AnalyticsDateRange, PageViewTrendPoint } from './types'

export const buildDailyTrends = (
  currentEvents: AppEvent[],
  previousEvents: AppEvent[],
  range: AnalyticsDateRange,
): PageViewTrendPoint[] => {
  const start = dayjs(range.start)
  const end = dayjs(range.end)
  const days = end.diff(start, 'day') + 1
  const bucketCount = Math.min(days, 12)
  const bucketSize = Math.ceil(days / bucketCount)

  return Array.from({ length: bucketCount }, (_, index) => {
    const bucketStart = start.add(index * bucketSize, 'day')
    const rawBucketEnd = bucketStart.add(bucketSize - 1, 'day')
    const bucketEnd = rawBucketEnd.isAfter(end) ? end : rawBucketEnd
    const prevBucketStart = bucketStart.subtract(days, 'day')
    const prevBucketEnd = bucketEnd.subtract(days, 'day')

    const countInBucket = (items: AppEvent[], from: Dayjs, to: Dayjs) =>
      items.filter(
        (event) =>
          event.type === 'page_view' &&
          isInRange(event.timestamp, from.startOf('day'), to.endOf('day')),
      ).length

    return {
      label: bucketStart.format('MMM D'),
      current: countInBucket(currentEvents, bucketStart, bucketEnd),
      previous: countInBucket(previousEvents, prevBucketStart, prevBucketEnd),
    }
  })
}

export const buildSparkline = (events: AppEvent[], range: AnalyticsDateRange): number[] => {
  const end = dayjs(range.end).endOf('day')
  return Array.from({ length: 7 }, (_, index) => {
    const day = end.subtract(6 - index, 'day')
    return events.filter(
      (event) =>
        event.type === 'page_view' &&
        isInRange(event.timestamp, day.startOf('day'), day.endOf('day')),
    ).length
  })
}
