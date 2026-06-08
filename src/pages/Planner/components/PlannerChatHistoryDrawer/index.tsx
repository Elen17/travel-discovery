import { DeleteOutlined, HistoryOutlined } from '@ant-design/icons'
import { Button, Drawer, Empty, List, Popconfirm } from 'antd'
import type { SavedPlannerSession } from '@/types/planner'
import styles from './styles.module.css'

type PlannerChatHistoryDrawerProps = {
  open: boolean
  sessions: SavedPlannerSession[]
  title: string
  emptyLabel: string
  restoreLabel: string
  deleteLabel: string
  messagesLabel: string
  plansLabel: string
  closeLabel: string
  getExplorationTitle: (explorationId: SavedPlannerSession['explorationId']) => string
  formatDate: (isoDate: string) => string
  onClose: () => void
  onRestore: (session: SavedPlannerSession) => void
  onDelete: (id: string) => void
}

export const PlannerChatHistoryDrawer = ({
  open,
  sessions,
  title,
  emptyLabel,
  restoreLabel,
  deleteLabel,
  messagesLabel,
  plansLabel,
  closeLabel,
  getExplorationTitle,
  formatDate,
  onClose,
  onRestore,
  onDelete,
}: PlannerChatHistoryDrawerProps) => (
  <Drawer
    title={
      <span className={styles.drawerTitle}>
        <HistoryOutlined aria-hidden />
        {title}
      </span>
    }
    open={open}
    onClose={onClose}
    width={420}
    footer={
      <Button onClick={onClose} block>
        {closeLabel}
      </Button>
    }
  >
    {sessions.length === 0 ? (
      <Empty description={emptyLabel} className={styles.empty} />
    ) : (
      <List
        className={styles.list}
        dataSource={sessions}
        renderItem={(session) => (
          <List.Item
            key={session.id}
            className={styles.item}
            actions={[
              <Button
                key="restore"
                type="link"
                size="small"
                onClick={() => onRestore(session)}
              >
                {restoreLabel}
              </Button>,
              <Popconfirm
                key="delete"
                title={deleteLabel}
                onConfirm={() => onDelete(session.id)}
                okText={deleteLabel}
                cancelText={closeLabel}
              >
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  aria-label={deleteLabel}
                />
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              title={<span className={styles.sessionTitle}>{session.title}</span>}
              description={
                <div className={styles.meta}>
                  <span>{getExplorationTitle(session.explorationId)}</span>
                  <span>{formatDate(session.updatedAt)}</span>
                  <span>
                    {session.messages.length} {messagesLabel}
                    {session.appliedItineraries.length > 0 &&
                      ` · ${session.appliedItineraries.length} ${plansLabel}`}
                  </span>
                </div>
              }
            />
          </List.Item>
        )}
      />
    )}
  </Drawer>
)
