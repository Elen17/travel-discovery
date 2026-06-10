import { apiClient } from '@/configs/axios'
import type { AvatarUploadResponse, CreateUserPayload, UpdateProfilePayload, User } from '@/types/user'

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await apiClient.get<User>('/users/me')
  return data
}

export const getUserList = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>('/admin/users')
  return data
}

export const getUserById = async (id: number): Promise<User> => {
  const { data } = await apiClient.get<User>(`/admin/users/${id}`)
  return data
}

export const deleteUser = async (id: number): Promise<void> => {
  const { data } = await apiClient.delete<void>(`/admin/users/${id}`)
  return data
}

export const updateUser = async (id: number, payload: Partial<User>): Promise<User> => {
  const { data } = await apiClient.put<User>(`/admin/users/${id}`, payload)
  return data
}

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const { data } = await apiClient.post<User>('/admin/users', payload)
  return data
}

export const updateProfile = async (payload: UpdateProfilePayload): Promise<User> => {
  const { data } = await apiClient.put<User>('/users/me', payload)
  return data
}

export const uploadAvatarTemp = async (file: File): Promise<AvatarUploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await apiClient.post<AvatarUploadResponse>(
    '/users/me/avatar/temp',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
  return data
}
