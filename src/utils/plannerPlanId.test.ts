import { describe, expect, it } from 'vitest'
import {
  isBackendPlanId,
  normalizePlanId,
  toApiPlanId,
  toChatPlanId,
} from './plannerPlanId'

describe('plannerPlanId utils', () => {
  describe('normalizePlanId', () => {
    it('returns null for empty or local-only ids', () => {
      expect(normalizePlanId(null)).toBeNull()
      expect(normalizePlanId(undefined)).toBeNull()
      expect(normalizePlanId('')).toBeNull()
      expect(normalizePlanId('guest_abc')).toBeNull()
      expect(normalizePlanId('share_abc')).toBeNull()
      expect(normalizePlanId('saved_abc')).toBeNull()
    })

    it('returns backend ids unchanged', () => {
      expect(normalizePlanId('plan-123')).toBe('plan-123')
      expect(normalizePlanId('mock_plan_1')).toBe('mock_plan_1')
    })
  })

  describe('isBackendPlanId', () => {
    it('accepts real backend plan ids', () => {
      expect(isBackendPlanId('plan-123')).toBe(true)
    })

    it('rejects local, mock, and empty ids', () => {
      expect(isBackendPlanId('guest_abc')).toBe(false)
      expect(isBackendPlanId('mock_plan_1')).toBe(false)
      expect(isBackendPlanId(null)).toBe(false)
    })
  })

  describe('toChatPlanId', () => {
    it('returns normalized ids for chat usage', () => {
      expect(toChatPlanId('plan-123')).toBe('plan-123')
      expect(toChatPlanId('guest_abc')).toBeUndefined()
    })
  })

  describe('toApiPlanId', () => {
    it('returns only persistable backend ids', () => {
      expect(toApiPlanId('plan-123')).toBe('plan-123')
      expect(toApiPlanId('mock_plan_1')).toBeUndefined()
      expect(toApiPlanId('guest_abc')).toBeUndefined()
    })
  })
})
