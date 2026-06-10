import type { DrawerProps } from 'antd'
import type { ReactNode } from 'react'

export type BaseDrawerProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: ReactNode
  placement?: DrawerProps['placement']
  size?: DrawerProps['size']
  destroyOnClose?: boolean
  className?: string
}
