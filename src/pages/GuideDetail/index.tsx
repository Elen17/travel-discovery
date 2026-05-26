import { PagePlaceholder } from '@/components/common/PagePlaceholder'
import { useParams } from 'react-router-dom'
import { GUIDE_DETAIL_I18N } from './const'
import styles from './styles.module.css'

const GuideDetailPage = () => {
  const { destination } = useParams<{ destination: string }>()

  return (
    <div className={styles.page} data-destination={destination}>
      <PagePlaceholder
        titleKey={GUIDE_DETAIL_I18N.title}
        descriptionKey={GUIDE_DETAIL_I18N.placeholder}
      />
    </div>
  )
}

export default GuideDetailPage
