import { Alert, Button, Form, Input, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { SESSION_EXPIRED_MODAL_I18N } from './const'
import styles from './styles.module.css'
import type { SessionExpiredFormValues, SessionExpiredModalProps } from './types'

export const SessionExpiredModal = ({
  open,
  email,
  loading = false,
  errorMessage,
  onCancel,
  onSubmit,
}: SessionExpiredModalProps) => {
  const { t } = useTranslation()
  const [form] = Form.useForm<SessionExpiredFormValues>()

  const handleFinish = (values: SessionExpiredFormValues) => {
    onSubmit(values.password)
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title={t(SESSION_EXPIRED_MODAL_I18N.title)}
      open={open}
      onCancel={handleCancel}
      footer={null}
      destroyOnHidden
    >
      <p className={styles.message}>{t(SESSION_EXPIRED_MODAL_I18N.message)}</p>

      {errorMessage ? (
        <Alert className={styles.error} type="error" message={errorMessage} showIcon />
      ) : null}

      <Form
        form={form}
        className={styles.form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
      >
        <Form.Item label={t(SESSION_EXPIRED_MODAL_I18N.email)}>
          <Input className={styles.emailInput} value={email} disabled />
        </Form.Item>

        <Form.Item
          name="password"
          label={t(SESSION_EXPIRED_MODAL_I18N.password)}
          rules={[{ required: true, message: t(SESSION_EXPIRED_MODAL_I18N.errors.passwordRequired) }]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {t(SESSION_EXPIRED_MODAL_I18N.submit)}
          </Button>
          <Button block onClick={handleCancel} style={{ marginTop: 8 }}>
            {t(SESSION_EXPIRED_MODAL_I18N.cancel)}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
