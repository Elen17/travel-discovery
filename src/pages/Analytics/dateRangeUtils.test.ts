import { describe, expect, it } from 'vitest'
import dayjs from 'dayjs'
import {
  filterByRange,
  fromDateRangeValue,
  getPreviousRange,
  isInRange,
  toDateRangeValue,
} from './dateRangeUtils'
import type { AppEvent } from '@/services/appEvents'

const sampleEvents: AppEvent[] = [
  {
    id: '1',
    type: 'page_view',
    timestamp: '2026-06-10T12:00:00.000Z',
    sessionId: 'session-1',
    deviceType: 'desktop',
    country: 'US',
  },
  {
    id: '2',
    type: 'search',
    timestamp: '2026-06-20T12:00:00.000Z',
    sessionId: 'session-1',
    deviceType: 'mobile',
    country: 'US',
  },
  {
    id: '3',
    type: 'custom',
    timestamp: '2026-07-01T12:00:00.000Z',
    sessionId: 'session-2',
    deviceType: 'tablet',
    country: 'AM',
  },
]

describe('dateRangeUtils', () => {
  it('converts analytics ranges to dayjs tuples', () => {
    const range = { start: '2026-06-01', end: '2026-06-30' }
    const [start, end] = toDateRangeValue(range)

    expect(start.format('YYYY-MM-DD')).toBe('2026-06-01')
    expect(end.format('YYYY-MM-DD')).toBe('2026-06-30')
  })

  it('normalizes reversed picker values', () => {
    const result = fromDateRangeValue([dayjs('2026-06-30'), dayjs('2026-06-01')])

    expect(result).toEqual({
      start: '2026-06-01',
      end: '2026-06-30',
    })
  })

  it('returns null when either picker value is missing', () => {
    expect(fromDateRangeValue([dayjs('2026-06-01'), null])).toBeNull()
    expect(fromDateRangeValue(null)).toBeNull()
  })

  it('checks whether timestamps fall inside a range', () => {
    const start = dayjs('2026-06-01').startOf('day')
    const end = dayjs('2026-06-30').endOf('day')

    expect(isInRange('2026-06-15T08:00:00.000Z', start, end)).toBe(true)
    expect(isInRange('2026-07-15T08:00:00.000Z', start, end)).toBe(false)
  })

  it('filters events by analytics range', () => {
    const filtered = filterByRange(sampleEvents, {
      start: '2026-06-01',
      end: '2026-06-30',
    })

    expect(filtered.map((event) => event.id)).toEqual(['1', '2'])
  })

  it('builds the previous period of equal length', () => {
    const previous = getPreviousRange({ start: '2026-06-10', end: '2026-06-20' })

    expect(previous).toEqual({
      start: '2026-05-30',
      end: '2026-06-09',
    })
  })
})
