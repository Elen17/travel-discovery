import { apiClient } from '@/configs/axios'
import type { AuthTokens, LoginPayload, RegisterPayload, User } from '@/types/user'

export const login = async (payload: LoginPayload): Promise<AuthTokens> => {
  const { data } = await apiClient.post<AuthTokens>('/auth/login', payload)
  return data
}

export const register = async (payload: RegisterPayload): Promise<AuthTokens> => {
  const { data } = await apiClient.post<AuthTokens>('/auth/register', payload)
  return data
}

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await apiClient.get<User>('/users/me')
  return data
}
