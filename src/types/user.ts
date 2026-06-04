export type User = {
  id: number
  fullName: string
  email: string
  avatarUrl: string | null
  createdAt: string
}

export type AuthResponse = {
  accessToken: string
  refreshToken: string
  user: User
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  fullName: string
  email: string
  password: string
}

export type UpdateProfilePayload = {
  fullName?: string
  avatarTempId?: string
}

export type AvatarUploadResponse = {
  tempId: string
  previewUrl: string
}
