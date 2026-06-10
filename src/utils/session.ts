const SESSION_EXPIRES_AT_KEY = 'sessionExpiresAt'
const LAST_USER_EMAIL_KEY = 'lastUserEmail'

export const SESSION_DURATION_MS = 15 * 60 * 1000

export const setSessionExpiry = (): void => {
  localStorage.setItem(SESSION_EXPIRES_AT_KEY, String(Date.now() + SESSION_DURATION_MS))
}

export const isSessionExpired = (): boolean => {
  const raw = localStorage.getItem(SESSION_EXPIRES_AT_KEY)
  if (!raw) {
    return true
  }

  const expiresAt = Number(raw)
  if (!Number.isFinite(expiresAt)) {
    return true
  }

  return Date.now() >= expiresAt
}

export const clearSessionExpiry = (): void => {
  localStorage.removeItem(SESSION_EXPIRES_AT_KEY)
}

export const storeLastUserEmail = (email: string): void => {
  localStorage.setItem(LAST_USER_EMAIL_KEY, email)
}

export const getLastUserEmail = (): string | null => localStorage.getItem(LAST_USER_EMAIL_KEY)

export const hasValidSession = (): boolean => {
  const token = localStorage.getItem('accessToken')
  return Boolean(token) && !isSessionExpired()
}
