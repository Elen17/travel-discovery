import type { ComponentType } from 'react'

export type HomePageProps = Record<string, never>

export type HomeCategory = {
  id: string
  labelKey: string
  icon: ComponentType<{ className?: string }>
}
