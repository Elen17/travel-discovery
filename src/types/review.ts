import type { PageParams } from './api'

export type Review = {
  id: number
  userId: number
  rating: number
  comment: string | null
  createdAt: string
}

export type ReviewPayload = {
  rating: number
  comment?: string
}

export type HotelReviewsParams = PageParams
