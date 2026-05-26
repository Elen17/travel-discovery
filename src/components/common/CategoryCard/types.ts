import type { ComponentType } from 'react'

export type CategoryCardProps = {
  label: string
  icon: ComponentType<{ className?: string }>
  onClick?: () => void
}
