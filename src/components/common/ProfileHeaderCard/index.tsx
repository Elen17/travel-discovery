import { CheckCircleFilled } from '@ant-design/icons'
import { Avatar } from 'antd'
import styles from './styles.module.css'
import type { ProfileHeaderCardProps } from './types'

export const ProfileHeaderCard = ({
  fullName,
  avatarUrl,
  verifiedLabel,
}: ProfileHeaderCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.avatarWrap}>
        <Avatar src={avatarUrl} size={96} className={styles.avatar} alt="" />
        <span className={styles.verifiedBadge} title={verifiedLabel} aria-label={verifiedLabel}>
          <CheckCircleFilled />
        </span>
      </div>
      <h1 className={styles.name}>{fullName}</h1>
    </div>
  )
}
