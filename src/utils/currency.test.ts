import { describe, expect, it } from 'vitest'
import { formatCurrency } from './currency'

describe('formatCurrency', () => {
  it('formats USD amounts without decimal places', () => {
    expect(formatCurrency(1200, 'USD', 'en-US')).toBe('$1,200')
  })

  it('uses the provided locale and currency', () => {
    const formatted = formatCurrency(500, 'EUR', 'de-DE')
    expect(formatted).toContain('500')
    expect(formatted).toMatch(/€|EUR/)
  })
})
