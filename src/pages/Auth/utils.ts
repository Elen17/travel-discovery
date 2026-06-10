import axios from 'axios'
import { isApiError } from '@/types/api'

export type ParsedAuthError = {
  message: string
  fieldErrors?: Record<string, string>
}

export const parseAuthError = (error: unknown, fallbackMessage: string): ParsedAuthError => {
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
