import { apiClient } from '@/configs/axios'
import type { Destination } from '@/types/destination'

export const getDestinations = async (): Promise<Destination[]> => {
  const { data } = await apiClient.get<Destination[]>('/destinations')
  return data
}
