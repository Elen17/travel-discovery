import { Button, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { LOGIN_REQUIRED_MODAL_I18N } from './const'
import styles from './styles.module.css'
import type { LoginRequiredModalProps } from './types'

export const LoginRequiredModal = ({ open, onCancel, onLogin }: LoginRequiredModalProps) => {
  const { t } = useTranslation()

  return (
    <Modal
      title={t(LOGIN_REQUIRED_MODAL_I18N.title)}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {t(LOGIN_REQUIRED_MODAL_I18N.cancel)}
        </Button>,
        <Button key="login" type="primary" onClick={onLogin}>
          {t(LOGIN_REQUIRED_MODAL_I18N.login)}
        </Button>,
      ]}
    >
      <p className={styles.message}>{t(LOGIN_REQUIRED_MODAL_I18N.message)}</p>
    </Modal>
  )
}
