import type { Rule } from 'antd/es/form'
import type { TFunction } from 'i18next'
import { PASSWORD_I18N } from '@/i18n/validation'

export const PASSWORD_MIN_LENGTH = 8

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const isNonEmptyString = (value: string): boolean => {
  return value.trim().length > 0
}

export const getPasswordRequiredRule = (t: TFunction): Rule => ({
  required: true,
  message: t(PASSWORD_I18N.required),
})

export const getNewPasswordRules = (t: TFunction): Rule[] => [
  getPasswordRequiredRule(t),
  { min: PASSWORD_MIN_LENGTH, message: t(PASSWORD_I18N.min) },
]
