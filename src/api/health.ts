import axios from 'axios'
import type { HealthResponse } from '@/types/api'

const API_ORIGIN = import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/v1\/?$/, '');

export const getHealth = async (): Promise<HealthResponse> => {
  const { data } = await axios.get<HealthResponse>(`${API_ORIGIN}/health`)
  return data
}
