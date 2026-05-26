export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const isNonEmptyString = (value: string): boolean => {
  return value.trim().length > 0
}
