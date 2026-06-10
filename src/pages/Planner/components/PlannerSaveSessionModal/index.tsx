import { Button, Input, Modal } from 'antd'
import { useEffect, useState } from 'react'
import styles from './styles.module.css'

type PlannerSaveSessionModalProps = {
  open: boolean
  title: string
  label: string
  confirmLabel: string
  cancelLabel: string
  defaultTitle: string
  onConfirm: (title: string) => void
  onCancel: () => void
}

export const PlannerSaveSessionModal = ({
  open,
  title,
  label,
  confirmLabel,
  cancelLabel,
  defaultTitle,
  onConfirm,
  onCancel,
}: PlannerSaveSessionModalProps) => {
  const [sessionTitle, setSessionTitle] = useState(defaultTitle)

  useEffect(() => {
    if (open) {
      setSessionTitle(defaultTitle)
    }
  }, [defaultTitle, open])

  const handleConfirm = () => {
    const trimmed = sessionTitle.trim()
    if (!trimmed) {
      return
    }
    onConfirm(trimmed)
  }

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {cancelLabel}
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={handleConfirm}
          disabled={!sessionTitle.trim()}
        >
          {confirmLabel}
        </Button>,
      ]}
    >
      <label className={styles.label} htmlFor="planner-save-title">
        {label}
      </label>
      <Input
        id="planner-save-title"
        value={sessionTitle}
        onChange={(event) => setSessionTitle(event.target.value)}
        onPressEnter={handleConfirm}
        maxLength={120}
        autoFocus
      />
    </Modal>
  )
}
