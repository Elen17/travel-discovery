import styles from './styles.module.css'
import type { CategoryCardProps } from './types'

export const CategoryCard = ({ label, icon: Icon, onClick }: CategoryCardProps) => {
  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <span className={styles.iconWrap}>
        <Icon />
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  )
}
