export type UserRole = 'Admin' | 'User'

export type User = {
  id: number
  fullName: string
  email: string
  avatarUrl: string | null
  role: UserRole
  createdAt: string
}

export type CreateUserPayload = {
  fullName: string
  email: string
  avatarUrl?: string | null
  password?: string
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
