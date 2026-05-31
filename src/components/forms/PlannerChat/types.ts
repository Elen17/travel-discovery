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
  onSend: (message: string) => void
}
