import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/store/hooks'
import { PlannerChat } from '../../PlannerChat'
import { PlannerChatHistoryDrawer } from '../PlannerChatHistoryDrawer'
import { PlannerSaveSessionModal } from '../PlannerSaveSessionModal'
import { ShareAlert } from '../ShareAlert'
import { PLANNER_I18N } from '../../const'
import { usePlannerChatHistory } from '../../hooks/usePlannerChatHistory'
import { usePlannerSaveSession } from '../../hooks/usePlannerSaveSession'

type PlannerChatSectionProps = {
  isSending: boolean
  onSend: (message: string) => void
}

export const PlannerChatSection = ({ isSending, onSend }: PlannerChatSectionProps) => {
  const { t } = useTranslation()
  const { messages, isOfflineMode } = useAppSelector((state) => state.planner)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  const saveSession = usePlannerSaveSession()
  const chatHistory = usePlannerChatHistory()

  const handleSaveConfirm = useCallback(
    (title: string) => {
      const saved = saveSession.saveSession(title)
      if (saved) {
        setFeedbackMessage(saveSession.saveSuccess)
        chatHistory.refreshHistory()
      }
    },
    [chatHistory, saveSession],
  )

  return (
    <>
      <ShareAlert message={feedbackMessage} onClose={() => setFeedbackMessage(null)} />

      <PlannerChat
        messages={messages}
        isSending={isSending}
        isOfflineMode={isOfflineMode}
        placeholder={t(PLANNER_I18N.chat.placeholder)}
        sendLabel={t(PLANNER_I18N.chat.send)}
        emptyLabel={t(PLANNER_I18N.chat.empty)}
        emptyHint={t(PLANNER_I18N.chat.emptyHint)}
        offlineLabel={t(PLANNER_I18N.chat.offline)}
        typingLabel={t(PLANNER_I18N.chat.typing)}
        historyLabel={chatHistory.historyLabel}
        saveLabel={saveSession.saveLabel}
        saveEmptyHint={saveSession.saveEmptyHint}
        canSave={saveSession.canSave}
        onSend={onSend}
        onOpenHistory={chatHistory.openHistory}
        onOpenSave={saveSession.openSaveModal}
      />

      <PlannerSaveSessionModal
        open={saveSession.saveModalOpen}
        title={saveSession.saveModalTitle}
        label={saveSession.saveModalLabel}
        confirmLabel={saveSession.saveModalConfirm}
        cancelLabel={saveSession.saveModalCancel}
        defaultTitle={saveSession.defaultTitle}
        onConfirm={handleSaveConfirm}
        onCancel={saveSession.closeSaveModal}
      />

      <PlannerChatHistoryDrawer
        open={chatHistory.historyOpen}
        sessions={chatHistory.savedSessions}
        title={chatHistory.historyTitle}
        emptyLabel={chatHistory.historyEmpty}
        restoreLabel={chatHistory.historyRestore}
        deleteLabel={chatHistory.historyDelete}
        messagesLabel={chatHistory.historyMessages}
        plansLabel={chatHistory.historyPlans}
        closeLabel={chatHistory.historyClose}
        getExplorationTitle={chatHistory.getExplorationTitle}
        formatDate={chatHistory.formatDate}
        onClose={chatHistory.closeHistory}
        onRestore={chatHistory.restoreSavedSession}
        onDelete={chatHistory.removeSavedSession}
      />
    </>
  )
}
