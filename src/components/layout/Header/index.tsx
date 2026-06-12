import { LogoutOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Drawer, Dropdown, Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { useLogout } from '@/hooks/useLogout'
import { useAppSelector } from '@/store/hooks'
import { UserRole } from '@/types/user'
import { HEADER_I18N, HEADER_LOGO_SRC, NAV_ITEMS } from './const'
import styles from './styles.module.css'

const { Header: AntHeader } = Layout

export const Header = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { logout, isLoggingOut } = useLogout()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const isProfileActive = location.pathname.startsWith('/profile')

  const isAdmin = user?.role === UserRole.ADMIN

  const visibleNavItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin)

  const selectedKey = isProfileActive
    ? ''
    : (visibleNavItems.find((item) =>
        item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path),
      )?.key ?? 'explore')

  const navMenuItems = useMemo(
    () =>
      visibleNavItems.map((item) => ({
        key: item.key,
        label: <Link to={item.path}>{t(item.labelKey)}</Link>,
      })),
    [t, visibleNavItems],
  )

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

  const closeMobileNav = () => {
    setMobileNavOpen(false)
  }

  return (
    <AntHeader className={styles.header}>
      <div className={styles.leading}>
        <Button
          type="text"
          className={styles.menuBtn}
          icon={<MenuOutlined />}
          aria-label={t(HEADER_I18N.openMenu)}
          onClick={() => setMobileNavOpen(true)}
        />
        <Link to="/" className={styles.brand}>
          <img src={HEADER_LOGO_SRC} alt={t('app.name')} className={styles.logoImg} />
        </Link>
      </div>

      <div className={styles.navWrap}>
        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          className={styles.nav}
          items={navMenuItems}
          disabledOverflow
        />
      </div>

      <div className={styles.actions}>
        <LanguageSwitcher className={styles.langBtn} />
        {isAuthenticated ? (
          <Dropdown menu={{ items: profileMenuItems }} placement="bottomRight" trigger={['click']}>
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

      <Drawer
        title={t('app.name')}
        placement="left"
        open={mobileNavOpen}
        onClose={closeMobileNav}
        className={styles.mobileNavDrawer}
        size={280}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={navMenuItems}
          onClick={closeMobileNav}
        />
      </Drawer>
    </AntHeader>
  )
}
