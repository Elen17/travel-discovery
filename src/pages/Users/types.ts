import type { User } from '@/types/user'

export type UsersModalMode = 'add' | 'edit' | 'delete' | null

export type UserFormValues = {
  fullName: string
  email: string
  avatarUrl?: string
}

export type UsersTableRow = User
