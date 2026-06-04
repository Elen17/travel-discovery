import { apiClient, storeAuthTokens } from '@/configs/axios'
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/user'

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload)
  storeAuthTokens(data.accessToken, data.refreshToken)
  return data
}

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload)
  storeAuthTokens(data.accessToken, data.refreshToken)
  return data
}

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout')
}
