import { Button } from 'antd'
import styles from './styles.module.css'
import type { PlannerAiBannerProps } from './types'

export const PlannerAiBanner = ({
  label,
  title,
  description,
  buttonLabel,
  onGenerate,
}: PlannerAiBannerProps) => {
  return (
    <section className={styles.banner} aria-label={title}>
      <span className={styles.decor} aria-hidden />
      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
      <Button className={styles.generateBtn} onClick={onGenerate}>
        {buttonLabel}
      </Button>
    </section>
  )
}
