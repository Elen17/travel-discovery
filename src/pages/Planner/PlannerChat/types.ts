import type { PlannerMessage } from '@/types/planner'
import type { PlannerAiSource } from '@/store/planner/types'

export type PlannerChatProps = {
  messages: PlannerMessage[]
  isSending: boolean
  aiSource: PlannerAiSource
  sourceGeminiLabel: string
  sourceBackendLabel: string
  sourceDemoLabel: string
  placeholder: string
  sendLabel: string
  emptyLabel: string
  emptyHint: string
  typingLabel: string
  historyLabel: string
  saveLabel: string
  saveEmptyHint: string
  canSave: boolean
  onSend: (message: string) => void
  onOpenHistory: () => void
  onOpenSave: () => void
}
