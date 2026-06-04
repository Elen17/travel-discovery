import { apiClient } from '@/configs/axios'
import type { AvatarUploadResponse, UpdateProfilePayload, User } from '@/types/user'

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await apiClient.get<User>('/users/me')
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
