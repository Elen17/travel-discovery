import type { BookingTab } from '../../types'

export type BookingTabsProps = {
  activeTab: BookingTab
  onTabChange: (tab: BookingTab) => void
}
