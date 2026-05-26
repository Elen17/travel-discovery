import { StarFilled } from '@ant-design/icons'
import styles from './styles.module.css'
import type { ReviewCardProps } from './types'

export const ReviewCard = ({ initials, author, date, rating, comment }: ReviewCardProps) => {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className={styles.avatar}>{initials}</span>
        <div className={styles.meta}>
          <span className={styles.author}>{author}</span>
          <span className={styles.date}>{date}</span>
        </div>
        <span className={styles.stars}>
          {Array.from({ length: rating }).map((_, i) => (
            <StarFilled key={i} />
          ))}
        </span>
      </div>
      <p className={styles.comment}>{comment}</p>
    </article>
  )
}
