import axios from 'axios'
import { isApiError } from '@/types/api'

export { isApiError } from '@/types/api'
export type { ApiError, PageParams, PageResponse } from '@/types/api'

export type ParsedApiError = {
  message: string
  fieldErrors?: Record<string, string>
}

export const parseApiError = (error: unknown, fallbackMessage: string): ParsedApiError => {
  if (!axios.isAxiosError(error) || !error.response?.data) {
    return { message: fallbackMessage }
  }

  const data = error.response.data
  if (isApiError(data)) {
    return {
      message: data.message,
      fieldErrors: data.fieldErrors,
    }
  }

  return { message: fallbackMessage }
}

export const formatApiFieldErrors = (fieldErrors: Record<string, string>): string =>
  Object.values(fieldErrors).join(' ')
