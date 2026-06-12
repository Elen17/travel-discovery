import { Alert, Button, Form, Input, Modal } from 'antd'
import { useEffect } from 'react'
import {
  getMockPaymentValidationError,
  type MockPaymentDetails,
  type MockPaymentValidationCode,
} from '@/services/payment'
import { applyMockPaymentFieldError } from './utils'
import styles from './styles.module.css'
import type { MockPaymentModalProps } from './types'

type PaymentFormValues = {
  cardName: string
  cardHolder: string
  cvv: string
}

const normalizeCardNumber = (value: string): string => value.replace(/\s+/g, '')

const validationMessages = (
  props: Pick<
    MockPaymentModalProps,
    'cardNameInvalid' | 'cardHolderInvalid' | 'cvvInvalid'
  >,
): Record<MockPaymentValidationCode, string> => ({
  INVALID_CARD_NAME: props.cardNameInvalid,
  INVALID_CARD_HOLDER: props.cardHolderInvalid,
  INVALID_CVV: props.cvvInvalid,
})

export const MockPaymentModal = ({
  open,
  amountLabel,
  totalLabel,
  title,
  cardNameLabel,
  cardHolderLabel,
  cvvLabel,
  cardNameRequired,
  cardNameInvalid,
  cardHolderRequired,
  cardHolderInvalid,
  cvvRequired,
  cvvInvalid,
  cancelLabel,
  payLabel,
  bookingError,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: MockPaymentModalProps) => {
  const [form] = Form.useForm<PaymentFormValues>()

  useEffect(() => {
    if (!open) {
      form.resetFields()
    }
  }, [form, open])

  const handlePayClick = async () => {
    try {
      await form.validateFields()
    } catch {
      return
    }

    const values = form.getFieldsValue()
    const details: MockPaymentDetails = {
      cardName: normalizeCardNumber(values.cardName ?? ''),
      cardHolder: (values.cardHolder ?? '').trim(),
      cvv: (values.cvv ?? '').trim(),
    }

    const validationError = getMockPaymentValidationError(details)
    if (validationError) {
      applyMockPaymentFieldError(form, validationError.code, validationMessages({
        cardNameInvalid,
        cardHolderInvalid,
        cvvInvalid,
      }))
      return
    }

    await onSubmit(details)
  }

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      destroyOnHidden
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={isSubmitting}>
          {cancelLabel}
        </Button>,
        <Button
          key="pay"
          type="primary"
          loading={isSubmitting}
          onClick={() => void handlePayClick()}
        >
          {payLabel}
        </Button>,
      ]}
    >
      {bookingError ? (
        <Alert type="error" showIcon title={bookingError} className={styles.bookingError} />
      ) : null}

      <div className={styles.totalRow}>
        <span>{amountLabel}</span>
        <span>{totalLabel}</span>
      </div>

      <Form form={form} layout="vertical" className={styles.form}>
        <Form.Item
          name="cardName"
          label={cardNameLabel}
          rules={[
            { required: true, message: cardNameRequired, whitespace: true },
            {
              validator: (_, value: string | undefined) => {
                const digits = normalizeCardNumber(value ?? '')
                if (!digits) {
                  return Promise.resolve()
                }
                if (!/^\d{13,19}$/.test(digits)) {
                  return Promise.reject(new Error(cardNameInvalid))
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <Input
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="4111 1111 1111 1111"
            maxLength={23}
            disabled={isSubmitting}
          />
        </Form.Item>

        <Form.Item
          name="cardHolder"
          label={cardHolderLabel}
          rules={[
            { required: true, message: cardHolderRequired, whitespace: true },
            { min: 2, message: cardHolderInvalid },
            {
              pattern: /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\s'.-]{1,79}$/,
              message: cardHolderInvalid,
            },
          ]}
        >
          <Input
            autoComplete="cc-name"
            placeholder={cardHolderLabel}
            maxLength={80}
            disabled={isSubmitting}
          />
        </Form.Item>

        <Form.Item
          name="cvv"
          label={cvvLabel}
          rules={[
            { required: true, message: cvvRequired, whitespace: true },
            {
              pattern: /^\d{3,4}$/,
              message: cvvInvalid,
            },
          ]}
        >
          <Input
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            maxLength={4}
            disabled={isSubmitting}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
