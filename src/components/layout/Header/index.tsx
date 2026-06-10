import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Dropdown, Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { useLogout } from '@/hooks/useLogout'
import { useAppSelector } from '@/store/hooks'
import { NAV_ITEMS } from './const'
import Logo from '../../../../public/logo.png'
import styles from './styles.module.css'

const { Header: AntHeader } = Layout

export const Header = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { logout, isLoggingOut } = useLogout()

  const isProfileActive = location.pathname.startsWith('/profile')

  const isAdmin = user?.role === 'Admin'

  const visibleNavItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin)

  const selectedKey = isProfileActive
    ? ''
    : (visibleNavItems.find((item) =>
        item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path),
      )?.key ?? 'explore')

  const profileMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: <Link to="/profile">{t('nav.profile')}</Link>,
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: t('nav.logout'),
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        void logout()
      },
    },
  ]

  return (
    <AntHeader className={styles.header}>
      <Link to="/" className={styles.brand}>
        <img src={Logo} />
      </Link>

      <Menu
        mode="horizontal"
        selectedKeys={[selectedKey]}
        className={styles.nav}
        items={visibleNavItems.map((item) => ({
          key: item.key,
          label: <Link to={item.path}>{t(item.labelKey)}</Link>,
        }))}
      />

      <div className={styles.actions}>
        <LanguageSwitcher className={styles.langBtn} />
        {isAuthenticated ? (
          <Dropdown menu={{ items: profileMenuItems }} placement="bottomRight" trigger={['click']}>
            <Button
              type="primary"
              icon={<UserOutlined />}
              className={styles.profileBtn}
              loading={isLoggingOut}
            >
              {user?.fullName ?? t('nav.profile')}
            </Button>
          </Dropdown>
        ) : (
          <Button
            type="primary"
            icon={<UserOutlined />}
            className={styles.profileBtn}
            onClick={() => navigate('/auth/login')}
          >
            {t('nav.profile')}
          </Button>
        )}
      </div>
    </AntHeader>
  )
}
