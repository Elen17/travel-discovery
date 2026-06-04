export type PageResponse<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export type PageParams = {
  page?: number
  size?: number
}

export type ApiError = {
  status: number
  error: string
  message: string
  path: string
  fieldErrors?: Record<string, string>
}

export type HealthResponse = {
  status: string
  timestamp: string
}

export const isApiError = (value: unknown): value is ApiError => {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return (
    typeof record.status === 'number' &&
    typeof record.error === 'string' &&
    typeof record.message === 'string' &&
    typeof record.path === 'string'
  )
}
