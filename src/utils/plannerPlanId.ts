const LOCAL_PLAN_ID_PREFIXES = ['guest_', 'share_', 'saved_'] as const

export const normalizePlanId = (planId: string | null | undefined): string | null => {
  if (!planId) {
    return null
  }
  if (LOCAL_PLAN_ID_PREFIXES.some((prefix) => planId.startsWith(prefix))) {
    return null
  }
  return planId
}

export const isBackendPlanId = (planId: string | null | undefined): planId is string => {
  const normalized = normalizePlanId(planId)
  if (!normalized) {
    return false
  }
  return !normalized.startsWith('mock_plan_')
}

export const toChatPlanId = (planId: string | null | undefined): string | undefined => {
  const normalized = normalizePlanId(planId)
  if (!normalized) {
    return undefined
  }
  return normalized
}

export const toApiPlanId = (planId: string | null | undefined): string | undefined =>
  isBackendPlanId(planId) ? planId : undefined
