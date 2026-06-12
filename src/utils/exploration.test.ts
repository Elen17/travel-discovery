import { describe, expect, it } from 'vitest'
import { isKnownExplorationId, KNOWN_EXPLORATION_IDS, DEFAULT_EXPLORATION_ID } from './exploration'

describe('exploration utils', () => {
  it('recognizes all known exploration ids', () => {
    for (const id of KNOWN_EXPLORATION_IDS) {
      expect(isKnownExplorationId(id)).toBe(true)
    }
  })

  it('rejects unknown exploration ids', () => {
    expect(isKnownExplorationId('paris')).toBe(false)
    expect(isKnownExplorationId('')).toBe(false)
  })

  it('uses iceland as the default exploration id', () => {
    expect(DEFAULT_EXPLORATION_ID).toBe('iceland')
  })
})
