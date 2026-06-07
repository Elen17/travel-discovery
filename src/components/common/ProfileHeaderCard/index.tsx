import { CameraOutlined, CheckCircleFilled } from '@ant-design/icons'
import { Avatar, Spin } from 'antd'
import { useRef, type ChangeEvent } from 'react'
import { PROFILE_AVATAR_ACCEPT } from './const'
import styles from './styles.module.css'
import type { ProfileHeaderCardProps } from './types'

export const ProfileHeaderCard = ({
  fullName,
  avatarUrl,
  verifiedLabel,
  canEditAvatar = false,
  changeAvatarLabel,
  isUploading = false,
  onAvatarChange,
}: ProfileHeaderCardProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  const handleSelectClick = () => {
    if (!canEditAvatar || isUploading) {
      return
    }

    inputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onAvatarChange) {
      onAvatarChange(file)
    }

    event.target.value = ''
  }

  return (
    <div className={styles.card}>
      <div className={styles.avatarWrap}>
        <Avatar src={avatarUrl ?? undefined} size={96} className={styles.avatar} alt="">
          {!avatarUrl ? initials : null}
        </Avatar>

        {canEditAvatar ? (
          <>
            <button
              type="button"
              className={styles.changeAvatarBtn}
              onClick={handleSelectClick}
              disabled={isUploading}
              aria-label={changeAvatarLabel}
            >
              <CameraOutlined />
            </button>
            <input
              ref={inputRef}
              type="file"
              accept={PROFILE_AVATAR_ACCEPT}
              className={styles.fileInput}
              onChange={handleFileChange}
            />
          </>
        ) : null}

        {isUploading ? (
          <span className={styles.uploadOverlay} aria-hidden>
            <Spin size="small" />
          </span>
        ) : null}

        <span className={styles.verifiedBadge} title={verifiedLabel} aria-label={verifiedLabel}>
          <CheckCircleFilled />
        </span>
      </div>
      <div className={styles.meta}>
        <h1 className={styles.name}>{fullName}</h1>
        {canEditAvatar && changeAvatarLabel ? (
          <button
            type="button"
            className={styles.changeAvatarLink}
            onClick={handleSelectClick}
            disabled={isUploading}
          >
            {changeAvatarLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}
