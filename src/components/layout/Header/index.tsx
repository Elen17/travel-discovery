import { UserOutlined } from '@ant-design/icons'
import { Button, Layout, Menu } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { useAppSelector } from '@/store/hooks'
import { NAV_ITEMS } from './const'
import styles from './styles.module.css'

const { Header: AntHeader } = Layout

export const Header = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  const isProfileActive = location.pathname.startsWith('/profile')

  const selectedKey = isProfileActive
    ? ''
    : (NAV_ITEMS.find((item) =>
        item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path),
      )?.key ?? 'explore')

  const profilePath = isAuthenticated ? '/profile' : '/auth/login'

  return (
    <AntHeader className={styles.header}>
      <Link to="/" className={styles.brand}>
        {t('app.name')}
      </Link>

      <Menu
        mode="horizontal"
        selectedKeys={[selectedKey]}
        className={styles.nav}
        items={NAV_ITEMS.map((item) => ({
          key: item.key,
          label: <Link to={item.path}>{t(item.labelKey)}</Link>,
        }))}
      />

      <div className={styles.actions}>
        <LanguageSwitcher className={styles.langBtn} />
        <Button
          type={isProfileActive ? 'text' : 'primary'}
          icon={<UserOutlined />}
          className={isProfileActive ? styles.profileLinkActive : styles.profileBtn}
          onClick={() => navigate(profilePath)}
        >
          {t('nav.profile')}
        </Button>
      </div>
    </AntHeader>
  )
}
