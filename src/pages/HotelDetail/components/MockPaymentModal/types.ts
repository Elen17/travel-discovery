import type { MockPaymentDetails } from '@/services/payment'

export type MockPaymentModalProps = {
  open: boolean
  amountLabel: string
  totalLabel: string
  title: string
  cardNameLabel: string
  cardHolderLabel: string
  cvvLabel: string
  cardNameRequired: string
  cardNameInvalid: string
  cardHolderRequired: string
  cardHolderInvalid: string
  cvvRequired: string
  cvvInvalid: string
  cancelLabel: string
  payLabel: string
  bookingError?: string | null
  isSubmitting?: boolean
  onCancel: () => void
  onSubmit: (details: MockPaymentDetails) => void | Promise<void>
}
