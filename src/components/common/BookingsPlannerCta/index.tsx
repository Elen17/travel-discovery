import { ArrowRightOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import styles from './styles.module.css'
import type { BookingsPlannerCtaProps } from './types'

export const BookingsPlannerCta = ({
  title,
  description,
  buttonLabel,
  onClick,
}: BookingsPlannerCtaProps) => {
  return (
    <section className={styles.banner} aria-label={title}>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
      <Button
        type="primary"
        className={styles.ctaBtn}
        icon={<ArrowRightOutlined />}
        iconPosition="end"
        onClick={onClick}
      >
        {buttonLabel}
      </Button>
    </section>
  )
}
