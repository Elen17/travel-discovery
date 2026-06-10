import { Button } from 'antd'
import styles from './styles.module.css'
import type { PlannerAiBannerProps } from './types'

export const PlannerAiBanner = ({
  label,
  title,
  description,
  buttonLabel,
  generatingLabel,
  sourceLabel,
  isGenerating = false,
  onGenerate,
}: PlannerAiBannerProps) => {
  return (
    <section className={styles.banner} aria-label={title}>
      <span className={styles.decor} aria-hidden />
      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        {sourceLabel && <span className={styles.sourceBadge}>{sourceLabel}</span>}
      </div>
      <Button
        className={styles.generateBtn}
        onClick={onGenerate}
        loading={isGenerating}
        disabled={isGenerating}
      >
        {isGenerating ? generatingLabel : buttonLabel}
      </Button>
    </section>
  )
}
