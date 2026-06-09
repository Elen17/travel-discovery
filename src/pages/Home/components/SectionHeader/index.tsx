import styles from './styles.module.css'
import type { SectionHeaderProps } from './types'

export const SectionHeader = ({
  eyebrow,
  title,
  titleId,
  centered,
  actions,
}: SectionHeaderProps) => {
  const headerClass = centered
    ? `${styles.sectionHeader} ${styles.sectionHeaderCentered}`
    : styles.sectionHeader

  return (
    <div className={headerClass}>
      <div className={styles.sectionHeaderText}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2 id={titleId} className={styles.sectionTitle}>
          {title}
        </h2>
      </div>
      {actions ? <div className={styles.sectionHeaderActions}>{actions}</div> : null}
    </div>
  )
}
