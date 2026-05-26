import { PagePlaceholder } from '@/components/common/PagePlaceholder'
import { GUIDES_I18N } from './const'
import styles from './styles.module.css'

const GuidesPage = () => {
  return (
    <div className={styles.page}>
      <PagePlaceholder titleKey={GUIDES_I18N.title} descriptionKey={GUIDES_I18N.placeholder} />
    </div>
  )
}

export default GuidesPage
