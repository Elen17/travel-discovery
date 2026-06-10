export const KNOWN_EXPLORATION_IDS = ['iceland', 'tuscany', 'kyoto', 'amalfi'] as const

export const DEFAULT_EXPLORATION_ID = KNOWN_EXPLORATION_IDS[0]

export const isKnownExplorationId = (value: string): boolean =>
  (KNOWN_EXPLORATION_IDS as readonly string[]).includes(value)

/** @deprecated Use isKnownExplorationId — exploration IDs are plain strings. */
export const isExplorationId = isKnownExplorationId
