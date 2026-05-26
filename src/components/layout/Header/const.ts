export type NavItem = {
  key: string
  path: string
  labelKey: string
  authOnly?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'explore', path: '/', labelKey: 'nav.explore' },
  { key: 'destinations', path: '/destinations', labelKey: 'nav.destinations' },
  { key: 'planner', path: '/planner', labelKey: 'nav.planner' },
  { key: 'bookings', path: '/bookings', labelKey: 'nav.bookings' },
]
