import { Button, Result } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { NOT_FOUND_I18N } from './const'
import styles from './styles.module.css'

const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.page}>
      <Result
        status="404"
        title={t(NOT_FOUND_I18N.title)}
        subTitle={t(NOT_FOUND_I18N.description)}
        extra={
          <Link to="/">
            <Button type="primary">{t(NOT_FOUND_I18N.backHome)}</Button>
          </Link>
        }
      />
    </div>
  )
}

export default NotFoundPage
