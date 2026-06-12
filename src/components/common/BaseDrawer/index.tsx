import { Drawer } from 'antd'
import { BASE_DRAWER_DEFAULT_PLACEMENT, BASE_DRAWER_DEFAULT_SIZE } from './const'
import type { BaseDrawerProps } from './types'
import styles from './styles.module.css'

export const BaseDrawer = ({
  open,
  onClose,
  children,
  title,
  placement = BASE_DRAWER_DEFAULT_PLACEMENT,
  size = BASE_DRAWER_DEFAULT_SIZE,
  destroyOnClose = false,
  className,
}: BaseDrawerProps) => (
  <Drawer
    open={open}
    onClose={onClose}
    title={title}
    placement={placement}
    size={size}
    destroyOnClose={destroyOnClose}
    className={className}
    rootClassName={styles.drawer}
  >
    {children}
  </Drawer>
)
