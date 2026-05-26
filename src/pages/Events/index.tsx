import { PagePlaceholder } from '@/components/common/PagePlaceholder'
import { EVENTS_I18N } from './const'
import styles from './styles.module.css'

const EventsPage = () => {
  return (
    <div className={styles.page}>
      <PagePlaceholder titleKey={EVENTS_I18N.title} descriptionKey={EVENTS_I18N.placeholder} />
    </div>
  )
}

export default EventsPage
