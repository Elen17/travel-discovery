export type ApiError = {
  error: string
  status: number
  timestamp: string
}

export const isApiError = (value: unknown): value is ApiError => {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return (
    typeof record.error === 'string' &&
    typeof record.status === 'number' &&
    typeof record.timestamp === 'string'
  )
}
