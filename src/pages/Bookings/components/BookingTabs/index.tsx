import { useTranslation } from 'react-i18next'
import { BOOKINGS_I18N, BOOKING_TABS } from '../../const'
import styles from './styles.module.css'
import type { BookingTabsProps } from './types'

export const BookingTabs = ({ activeTab, onTabChange }: BookingTabsProps) => {
  const { t } = useTranslation()

  return (
    <div className={styles.tabs} role="tablist" aria-label={t(BOOKINGS_I18N.title)}>
      {BOOKING_TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={activeTab === tab}
          className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
          onClick={() => onTabChange(tab)}
        >
          {t(BOOKINGS_I18N.tabs[tab])}
        </button>
      ))}
    </div>
  )
}
