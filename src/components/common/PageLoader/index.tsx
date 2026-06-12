import { Spin } from 'antd'
import styles from './styles.module.css'

export const PageLoader = () => (
  <div className={styles.loader}>
    <Spin size="large" />
  </div>
)
