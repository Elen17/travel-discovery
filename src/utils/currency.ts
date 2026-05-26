export const formatCurrency = (
  amount: number,
  currency = 'USD',
  locale = 'en',
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
