import { describe, expect, it } from 'vitest'
import { isNonEmptyString, isValidEmail, PASSWORD_MIN_LENGTH } from './validation'

describe('validation utils', () => {
  describe('isValidEmail', () => {
    it('accepts valid email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true)
      expect(isValidEmail('name.surname@travel.io')).toBe(true)
    })

    it('rejects invalid email addresses', () => {
      expect(isValidEmail('not-an-email')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
    })
  })

  describe('isNonEmptyString', () => {
    it('accepts strings with non-whitespace content', () => {
      expect(isNonEmptyString('hello')).toBe(true)
    })

    it('rejects blank strings', () => {
      expect(isNonEmptyString('')).toBe(false)
      expect(isNonEmptyString('   ')).toBe(false)
    })
  })

  it('defines a minimum password length of 8', () => {
    expect(PASSWORD_MIN_LENGTH).toBe(8)
  })
})
