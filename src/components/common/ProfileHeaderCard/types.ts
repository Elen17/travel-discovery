export type ProfileHeaderCardProps = {
  fullName: string
  avatarUrl?: string | null
  verifiedLabel: string
  canEditAvatar?: boolean
  changeAvatarLabel?: string
  isUploading?: boolean
  onAvatarChange?: (file: File) => void
}
