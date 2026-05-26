import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { SIDEBAR_I18N } from './const'
import styles from './styles.module.css'
import type { PlannerSidebarProps } from './types'

export const PlannerSidebar = ({
  explorations,
  activeId,
  onSelect,
  onNewChat,
}: PlannerSidebarProps) => {
  const { t } = useTranslation()

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>{t(SIDEBAR_I18N.title)}</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className={styles.newChatBtn}
        onClick={onNewChat}
      >
        {t(SIDEBAR_I18N.newChat)}
      </Button>

      <span className={styles.sectionLabel}>{t(SIDEBAR_I18N.recentExplorations)}</span>
      <ul className={styles.list}>
        {explorations.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={`${styles.item} ${item.id === activeId ? styles.itemActive : ''}`}
              onClick={() => onSelect(item.id)}
            >
              <span className={styles.itemTitle}>{t(item.titleKey)}</span>
              <span className={styles.itemMeta}>{t(item.metaKey)}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
