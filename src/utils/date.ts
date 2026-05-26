import dayjs from 'dayjs'
import 'dayjs/locale/hy-am'
import 'dayjs/locale/ru'

const localeMap: Record<string, string> = {
  en: 'en',
  hy: 'hy-am',
  ru: 'ru',
}

export const formatDate = (date: string | Date, locale = 'en'): string => {
  const dayjsLocale = localeMap[locale] ?? 'en'
  return dayjs(date).locale(dayjsLocale).format('MMM D, YYYY')
}

export const formatDateRange = (
  checkIn: string,
  checkOut: string,
  locale = 'en',
): string => {
  return `${formatDate(checkIn, locale)} – ${formatDate(checkOut, locale)}`
}
