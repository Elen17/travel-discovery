import { describe, expect, it } from 'vitest'
import { formatDate, formatDateRange } from './date'

describe('date utils', () => {
  it('formats a single date for the requested locale', () => {
    expect(formatDate('2026-06-15', 'en')).toBe('Jun 15, 2026')
  })

  it('formats a date range with an en dash separator', () => {
    expect(formatDateRange('2026-06-15', '2026-06-20', 'en')).toBe(
      'Jun 15, 2026 – Jun 20, 2026',
    )
  })
})
