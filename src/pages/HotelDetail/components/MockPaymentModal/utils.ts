import type { FormInstance } from 'antd'
import type { MockPaymentField, MockPaymentValidationCode } from '@/services/payment'

type PaymentFieldMessages = Record<MockPaymentValidationCode, string>

const fieldByCode: Record<MockPaymentValidationCode, MockPaymentField> = {
  INVALID_CARD_NAME: 'cardName',
  INVALID_CARD_HOLDER: 'cardHolder',
  INVALID_CVV: 'cvv',
}

export const applyMockPaymentFieldError = (
  form: FormInstance,
  code: MockPaymentValidationCode,
  messages: PaymentFieldMessages,
): void => {
  const field = fieldByCode[code]
  form.setFields([{ name: field, errors: [messages[code]] }])
}
