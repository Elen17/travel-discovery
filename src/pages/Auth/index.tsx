import { PagePlaceholder } from '@/components/common/PagePlaceholder'
import { AUTH_I18N } from './const'
import styles from './styles.module.css'

const AuthPage = () => {
  return (
    <div className={styles.page}>
      <PagePlaceholder titleKey={AUTH_I18N.title} descriptionKey={AUTH_I18N.placeholder} />
    </div>
  )
}

export default AuthPage
