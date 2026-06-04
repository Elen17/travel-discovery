import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/store/hooks'
import { PlannerChat } from '../../PlannerChat'
import { PLANNER_I18N } from '../../const'

type PlannerChatSectionProps = {
  isSending: boolean
  onSend: (message: string) => void
}

export const PlannerChatSection = ({ isSending, onSend }: PlannerChatSectionProps) => {
  const { t } = useTranslation()
  const { messages, isOfflineMode } = useAppSelector((state) => state.planner)

  return (
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
      onSend={onSend}
    />
  )
}
