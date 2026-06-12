import axios from 'axios'
import { clearSessionExpiry, setSessionExpiry } from '@/utils/session'
import { message } from 'antd'
import i18n from '@/i18n'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const LOGIN_PATH = '/login'

let isHandling403 = false

export const isForbiddenError = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.status === 403

const handleForbidden = () => {
  if (isHandling403 || window.location.pathname === LOGIN_PATH) {
    return
  }

  isHandling403 = true

  message.error({
    content: i18n.t('common.errors.forbidden'),
    duration: 2,
    onClose: () => {
      isHandling403 = false
    },
  })

  window.setTimeout(() => {
    if (window.location.pathname !== LOGIN_PATH) {
      window.location.assign(LOGIN_PATH)
    }
  }, 300)
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export const getStoredAccessToken = (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY)

export const getStoredRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY)

export const storeAuthTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  setSessionExpiry()
}

export const clearAuthTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  clearSessionExpiry()
}

apiClient.interceptors.request.use((config) => {
  const token = getStoredAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken')
      }

      if (error.response?.status === 403) {
        handleForbidden()
      }
    }

    return Promise.reject(error)
  },
)
