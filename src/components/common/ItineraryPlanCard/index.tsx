import { Button } from 'antd'
import type { ItineraryCategory } from '@/pages/Planner/types'
import styles from './styles.module.css'
import type { ItineraryPlanCardProps } from './types'

const categoryClassMap: Record<ItineraryCategory, string> = {
  nature: styles.categoryNature,
  wellness: styles.categoryWellness,
  adventure: styles.categoryAdventure,
}

export const ItineraryPlanCard = ({
  title,
  description,
  imageUrl,
  category,
  categoryLabel,
  duration,
  usePlanLabel,
  onUsePlan,
}: ItineraryPlanCardProps) => {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={imageUrl} alt="" className={styles.image} loading="lazy" />
        <div className={styles.badges}>
          <span className={`${styles.categoryTag} ${categoryClassMap[category]}`}>
            {categoryLabel}
          </span>
          <span className={styles.duration}>{duration}</span>
        </div>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <Button className={styles.useBtn} onClick={onUsePlan}>
          {usePlanLabel}
        </Button>
      </div>
    </article>
  )
}
