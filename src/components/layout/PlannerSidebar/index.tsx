import { PlusOutlined } from '@ant-design/icons'
import { Button, Empty, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { SIDEBAR_I18N } from './const'
import styles from './styles.module.css'
import type { PlannerSidebarProps } from './types'

export const PlannerSidebar = ({
  plans,
  activeId,
  onSelect,
  onNewChat,
  showNewChat = false,
  canNewChat = true,
  newChatHint,
}: PlannerSidebarProps) => {
  const { t } = useTranslation()

  const newChatButton = (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      className={styles.newChatBtn}
      onClick={onNewChat}
      disabled={!canNewChat}
    >
      {t(SIDEBAR_I18N.newChat)}
    </Button>
  )

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>{t(SIDEBAR_I18N.title)}</h2>
      {showNewChat &&
        (canNewChat || !newChatHint ? (
          newChatButton
        ) : (
          <Tooltip title={newChatHint}>{newChatButton}</Tooltip>
        ))}

      <span className={styles.sectionLabel}>{t(SIDEBAR_I18N.dailyPlans)}</span>
      {plans.length === 0 ? (
        <Empty description={t(SIDEBAR_I18N.dailyPlansEmpty)} className={styles.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <ul className={styles.list}>
          {plans.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`${styles.item} ${item.id === activeId ? styles.itemActive : ''}`}
                onClick={() => onSelect(item.id)}
              >
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.itemMeta}>{item.meta}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
