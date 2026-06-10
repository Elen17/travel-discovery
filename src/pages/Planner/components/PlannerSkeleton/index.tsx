import { Skeleton } from 'antd'
import styles from '../../styles.module.css'

export const PlannerSkeleton = () => (
  <div className={styles.page}>
    <div className={styles.skeletonSidebar}>
      <Skeleton active paragraph={{ rows: 6 }} />
    </div>
    <main className={styles.main}>
      <Skeleton.Image active className={styles.skeletonHero} />
      <Skeleton active paragraph={{ rows: 4 }} />
    </main>
  </div>
)
