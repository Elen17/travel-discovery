import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Dropdown, Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BaseDrawer } from '@/components/common/BaseDrawer'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { useLogout } from '@/hooks/useLogout'
import { useAppSelector } from '@/store/hooks'
import { UserRole } from '@/types/user'
import { NAV_ITEMS } from './const'
import Logo from '../../../../public/logo.png'
import styles from './styles.module.css'

const { Header: AntHeader } = Layout
const { useBreakpoint } = Grid

export const Header = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const screens = useBreakpoint()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { logout, isLoggingOut } = useLogout()
  const [navDrawerOpen, setNavDrawerOpen] = useState<boolean>(false)

  const isDesktopNav = screens.lg ?? false

  const isProfileActive = location.pathname.startsWith('/profile')

  const isAdmin = user?.role === UserRole.ADMIN

  const visibleNavItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin)

  const selectedKey = isProfileActive
    ? ''
    : (visibleNavItems.find((item) =>
        item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path),
      )?.key ?? 'explore')

  const navMenuItems: MenuProps['items'] = visibleNavItems.map((item) => ({
    key: item.key,
    label: <Link to={item.path}>{t(item.labelKey)}</Link>,
  }))

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
      <div className={styles.container}>
        <Link to="/" className={styles.brand}>
          <img src={Logo} alt="Travel Discovery" className={styles.img} />
        </Link>

        <div className={styles.inner}>
          {isDesktopNav ? (
            <Menu
              mode="horizontal"
              selectedKeys={[selectedKey]}
              className={styles.nav}
              items={navMenuItems}
            />
          ) : (
            <Button
              type="primary"
              icon={
                user?.avatarUrl ? (
                  <Avatar
                    src={user.avatarUrl}
                    size={24}
                    className={styles.profileAvatar}
                    alt={user.fullName}
                  />
                ) : (
                  <UserOutlined />
                )
              }
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
