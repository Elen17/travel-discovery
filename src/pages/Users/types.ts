import type { User } from '@/types/user'

export const UsersModalType = {
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete',
} as const

export type UsersModalType = (typeof UsersModalType)[keyof typeof UsersModalType]

export type UsersModalMode = UsersModalType | null

export type UserFormValues = {
  fullName: string
  email: string
  password?: string
  avatarUrl?: string
}

export type UsersTableRow = User
