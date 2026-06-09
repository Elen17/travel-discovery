import type { ReactNode } from 'react'

export type SectionHeaderProps = {
  eyebrow: string
  title: string
  titleId?: string
  centered?: boolean
  actions?: ReactNode
}
