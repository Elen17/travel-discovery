import type { PlannerMessage } from '@/types/planner'

export type PlannerChatProps = {
  messages: PlannerMessage[]
  isSending: boolean
  isOfflineMode: boolean
  placeholder: string
  sendLabel: string
  emptyLabel: string
  emptyHint: string
  offlineLabel: string
  typingLabel: string
  historyLabel: string
  saveLabel: string
  saveEmptyHint: string
  canSave: boolean
  onSend: (message: string) => void
  onOpenHistory: () => void
  onOpenSave: () => void
}
