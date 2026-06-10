import { HistoryOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons'
import { Button, Input, Tooltip } from 'antd'
import { useState } from 'react'
import type { PlannerAiSource } from '@/store/planner/types'
import styles from './styles.module.css'
import type { PlannerChatProps } from './types'

const sourceBannerClass = (aiSource: PlannerAiSource): string | undefined => {
  if (aiSource === 'gemini') {
    return styles.sourceGemini
  }
  if (aiSource === 'backend') {
    return styles.sourceBackend
  }
  if (aiSource === 'demo') {
    return styles.sourceDemo
  }
  return undefined
}

export const PlannerChat = ({
  messages,
  isSending,
  aiSource,
  sourceGeminiLabel,
  sourceBackendLabel,
  sourceDemoLabel,
  placeholder,
  sendLabel,
  emptyLabel,
  emptyHint,
  typingLabel,
  historyLabel,
  saveLabel,
  saveEmptyHint,
  canSave,
  onSend,
  onOpenHistory,
  onOpenSave,
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

  const sourceLabel =
    aiSource === 'gemini'
      ? sourceGeminiLabel
      : aiSource === 'backend'
        ? sourceBackendLabel
        : aiSource === 'demo'
          ? sourceDemoLabel
          : null

  const sourceClass = sourceBannerClass(aiSource)

  return (
    <section className={styles.plannerChat} aria-label={emptyLabel}>
      <div className={styles.toolbar}>
        <Tooltip title={historyLabel}>
          <Button
            type="text"
            size="small"
            icon={<HistoryOutlined />}
            onClick={onOpenHistory}
            aria-label={historyLabel}
          >
            {historyLabel}
          </Button>
        </Tooltip>
        <Tooltip title={canSave ? saveLabel : saveEmptyHint}>
          <Button
            type="text"
            size="small"
            icon={<SaveOutlined />}
            onClick={onOpenSave}
            disabled={!canSave}
            aria-label={saveLabel}
          >
            {saveLabel}
          </Button>
        </Tooltip>
      </div>

      {sourceLabel && sourceClass && (
        <div className={`${styles.sourceBanner} ${sourceClass}`} role="status">
          {sourceLabel}
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
