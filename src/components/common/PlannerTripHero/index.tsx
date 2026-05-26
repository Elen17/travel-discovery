import { CalendarOutlined, ExportOutlined, ShareAltOutlined, UserOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import styles from './styles.module.css'
import type { PlannerTripHeroProps } from './types'

export const PlannerTripHero = ({
  imageUrl,
  eyebrow,
  title,
  dates,
  travelers,
  shareLabel,
  exportPdfLabel,
  onShare,
  onExportPdf,
}: PlannerTripHeroProps) => {
  return (
    <section className={styles.hero} aria-label={title}>
      <img src={imageUrl} alt="" className={styles.image} />
      <span className={styles.overlay} aria-hidden />

      <div className={styles.actions}>
        <button type="button" className={styles.shareBtn} onClick={onShare} aria-label={shareLabel}>
          <ShareAltOutlined />
        </button>
        <Button
          icon={<ExportOutlined />}
          className={styles.exportBtn}
          onClick={onExportPdf}
        >
          {exportPdfLabel}
        </Button>
      </div>

      <div className={styles.content}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <CalendarOutlined />
            {dates}
          </span>
          <span className={styles.metaItem}>
            <UserOutlined />
            {travelers}
          </span>
        </div>
      </div>
    </section>
  )
}
