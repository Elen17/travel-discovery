import { SendOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import { useState } from 'react'
import styles from './styles.module.css'
import type { PlannerChatProps } from './types'

export const PlannerChat = ({
  messages,
  isSending,
  isOfflineMode,
  placeholder,
  sendLabel,
  emptyLabel,
  emptyHint,
  offlineLabel,
  typingLabel,
  onSend,
}: PlannerChatProps) => {
  const [input, setInput] = useState('')

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || isSending) {
      return
    }
    onSend(trimmed)
    setInput('')
  }

  return (
    <section className={styles.plannerChat} aria-label={emptyLabel}>
      {isOfflineMode && (
        <div className={styles.offlineBanner} role="status">
          {offlineLabel}
        </div>
      )}

      <div className={styles.messages}>
        {messages.length === 0 && !isSending ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>{emptyLabel}</p>
            <p className={styles.emptyHint}>{emptyHint}</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`${styles.bubble} ${
                message.role === 'user' ? styles.user : styles.assistant
              }`}
            >
              {message.content}
            </div>
          ))
        )}
        {isSending && <div className={styles.typing}>{typingLabel}</div>}
      </div>

      <div className={styles.inputRow}>
        <Input
          className={styles.input}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onPressEnter={handleSend}
          placeholder={placeholder}
          disabled={isSending}
          aria-label={placeholder}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={isSending || !input.trim()}
          aria-label={sendLabel}
        >
          {sendLabel}
        </Button>
      </div>
    </section>
  )
}
