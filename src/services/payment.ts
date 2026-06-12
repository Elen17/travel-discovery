export type MockPaymentDetails = {
  cardName: string
  cardHolder: string
  cvv: string
}

export type MockPaymentResult = {
  transactionId: string
  amount: number
  processedAt: string
}

export type MockPaymentValidationCode =
  | 'INVALID_CARD_NAME'
  | 'INVALID_CARD_HOLDER'
  | 'INVALID_CVV'

export type MockPaymentField = 'cardName' | 'cardHolder' | 'cvv'

export type MockPaymentValidationError = {
  code: MockPaymentValidationCode
  field: MockPaymentField
}

const CARD_NUMBER_PATTERN = /^\d{13,19}$/
const CVV_PATTERN = /^\d{3,4}$/
const CARD_HOLDER_PATTERN = /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\s'.-]{1,79}$/

const normalizeCardNumber = (value: string): string => value.replace(/\s+/g, '')

const passesLuhnCheck = (cardNumber: string): boolean => {
  let sum = 0
  let shouldDouble = false

  for (let index = cardNumber.length - 1; index >= 0; index -= 1) {
    let digit = Number.parseInt(cardNumber[index] ?? '0', 10)
    if (Number.isNaN(digit)) {
      return false
    }
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}

export const getMockPaymentValidationError = (
  details: MockPaymentDetails,
): MockPaymentValidationError | null => {
  const cardNumber = normalizeCardNumber(details.cardName.trim())
  const cardHolder = details.cardHolder.trim()
  const cvv = details.cvv.trim()

  if (!cardNumber || !CARD_NUMBER_PATTERN.test(cardNumber) || !passesLuhnCheck(cardNumber)) {
    return { code: 'INVALID_CARD_NAME', field: 'cardName' }
  }

  if (!cardHolder || !CARD_HOLDER_PATTERN.test(cardHolder)) {
    return { code: 'INVALID_CARD_HOLDER', field: 'cardHolder' }
  }

  if (!cvv || !CVV_PATTERN.test(cvv)) {
    return { code: 'INVALID_CVV', field: 'cvv' }
  }

  return null
}

/** Simulates card processing — no real charges. */
export const processMockPayment = async (
  details: MockPaymentDetails,
  amount: number,
): Promise<MockPaymentResult> => {
  const validationError = getMockPaymentValidationError(details)
  if (validationError) {
    throw validationError
  }

  await new Promise((resolve) => setTimeout(resolve, 900))

  return {
    transactionId: `mock_tx_${Date.now()}`,
    amount,
    processedAt: new Date().toISOString(),
  }
}
