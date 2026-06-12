export type NavItem = {
  key: string
  path: string
  labelKey: string
  authOnly?: boolean
  adminOnly?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'explore', path: '/', labelKey: 'nav.explore' },
  { key: 'destinations', path: '/destinations', labelKey: 'nav.destinations' },
  { key: 'planner', path: '/planner', labelKey: 'nav.planner' },
  { key: 'bookings', path: '/bookings', labelKey: 'nav.bookings' },
  { key: 'analytics', path: '/analytics', labelKey: 'nav.analytics', adminOnly: true },
  { key: 'users', path: '/users', labelKey: 'nav.users', adminOnly: true },
]

export const HEADER_I18N = {
  openMenu: 'nav.openMenu',
} as const

export const HEADER_LOGO_SRC = '/logo.png'
