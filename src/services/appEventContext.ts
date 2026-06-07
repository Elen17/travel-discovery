export type DeviceType = 'mobile' | 'tablet' | 'desktop'

const SESSION_KEY = 'td_session_id'
const COUNTRY_KEY = 'td_country'

let cachedUserId: number | null = null
let cachedCountry: string | null = null
let countryInitStarted = false

export const getOrCreateSessionId = (): string => {
  try {
    const existing = localStorage.getItem(SESSION_KEY)
    if (existing) return existing
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    localStorage.setItem(SESSION_KEY, sessionId)
    return sessionId
  } catch {
    return `sess_${Date.now()}`
  }
}

export const normalizeDeviceType = (deviceType?: string): DeviceType => {
  if (deviceType === 'mobile' || deviceType === 'tablet' || deviceType === 'desktop') {
    return deviceType
  }
  return 'desktop'
}

export const getDeviceType = (): DeviceType => {
  if (typeof window === 'undefined') return 'desktop'
  const ua = navigator.userAgent
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (ua.includes('Android') && !/Mobile/i.test(ua))) {
    return 'tablet'
  }
  if (/Mobi|iPhone|iPod|Android.+Mobile|BlackBerry|Opera Mini/i.test(ua)) return 'mobile'
  if (/Windows|Macintosh|Linux|CrOS/i.test(ua)) return 'desktop'
  if (window.matchMedia('(max-width: 768px)').matches) return 'mobile'
  if (window.matchMedia('(max-width: 1024px)').matches) return 'tablet'
  return 'desktop'
}

const getCountryFromLocale = (): string => {
  const locale = navigator.language
  try {
    const region = new Intl.Locale(locale).region
    if (region) {
      const display = new Intl.DisplayNames([locale], { type: 'region' })
      return display.of(region) ?? region
    }
  } catch {
    const parts = locale.split('-')
    if (parts.length > 1) return parts[1].toUpperCase()
  }
  return 'Unknown'
}

const readCachedCountry = (): string | null => {
  try {
    return sessionStorage.getItem(COUNTRY_KEY) ?? cachedCountry
  } catch {
    return cachedCountry
  }
}

const storeCountry = (country: string): void => {
  cachedCountry = country
  try {
    sessionStorage.setItem(COUNTRY_KEY, country)
  } catch {
    // sessionStorage unavailable
  }
}

export const resolveCountryAsync = async (): Promise<string> => {
  const cached = readCachedCountry()
  if (cached) return cached

  const localeCountry = getCountryFromLocale()
  storeCountry(localeCountry)

  try {
    const response = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(4000),
    })
    if (!response.ok) return localeCountry
    const data: { country_name?: string; country_code?: string } = await response.json()
    const country = data.country_name ?? data.country_code ?? localeCountry
    storeCountry(country)
    return country
  } catch {
    return localeCountry
  }
}

export const initAppEventContext = (): void => {
  getOrCreateSessionId()
  getDeviceType()

  if (countryInitStarted) return
  countryInitStarted = true

  const cached = readCachedCountry()
  if (!cached) {
    storeCountry(getCountryFromLocale())
  }

  void resolveCountryAsync()
}

export const getCountryForEvent = (): string => readCachedCountry() ?? getCountryFromLocale()

export const setAnalyticsUserId = (userId: number | null): void => {
  cachedUserId = userId
}

export const getAnalyticsUserId = (): number | null => cachedUserId
