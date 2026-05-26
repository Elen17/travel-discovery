import type { ComponentType } from 'react'

export type HomePageProps = Record<string, never>

export type HomeCategory = {
  id: string
  labelKey: string
  icon: ComponentType<{ className?: string }>
}

export type TrendingDestination = {
  id: string
  cityKey: string
  countryKey: string
  imageUrl: string
  avgPrice: number
  cityQuery: string
}

export type HomeSearchValues = {
  destination?: string
  checkIn?: string
  checkOut?: string
  guests?: number
}
