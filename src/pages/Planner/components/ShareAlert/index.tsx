import { Alert } from 'antd'
import styles from '../../styles.module.css'

type ShareAlertProps = {
  message: string | null
  onClose: () => void
}

export const ShareAlert = ({ message, onClose }: ShareAlertProps) => {
  if (!message) {
    return null
  }

  return (
    <Alert
      message={message}
      type="success"
      showIcon
      closable
      className={styles.alert}
      onClose={onClose}
    />
  )
}
