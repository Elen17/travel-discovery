import { Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'
import { HotelListingCard } from '@/components/common/HotelListingCard'
import { useFavouriteSave } from '@/hooks/useFavouriteSave'
import { formatCurrency } from '@/utils/currency'
import { PAGE_SIZE } from '@/pages/Destinations/const'
import { DESTINATION_LIST_I18N } from './const'
import type { DestinationListProps } from './types'
import { formatHotelLocation } from './utils'
import styles from './styles.module.css'

export const DestinationList = ({
  hotels,
  totalResults,
  isLoading,
  onBookNow,
}: DestinationListProps) => {
  const { t, i18n } = useTranslation()
  const { toggleFavourite, savedHotelIds, savingHotelId, modals } = useFavouriteSave()

  if (isLoading) {
    return (
      <section className={styles.listSection}>
        <Skeleton active paragraph={{ rows: 1 }} className={styles.skeletonCount} />
        <div className={styles.grid}>
          {Array.from({ length: PAGE_SIZE }, (_, i) => (
            <Skeleton key={i} active className={styles.skeletonCard} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className={styles.listSection}>
      <p className={styles.resultsCount}>
        {t(DESTINATION_LIST_I18N.resultsCount, { count: totalResults })}
      </p>

      {hotels.length === 0 ? (
        <p className={styles.empty}>{t('pages.destinations.empty')}</p>
      ) : (
        <div className={styles.grid}>
          {hotels.map((hotel) => (
            <HotelListingCard
              key={hotel.id}
              id={String(hotel.id)}
              name={hotel.name}
              location={formatHotelLocation(hotel.city, hotel.country)}
              priceLabel={formatCurrency(hotel.pricePerNight, 'USD', i18n.language)}
              perNightLabel={t(DESTINATION_LIST_I18N.perNight)}
              guestRating={hotel.averageRating ?? 0}
              imageUrl={hotel.mainImageUrl}
              isFeatured={hotel.isFeatured}
              featuredLabel={t(DESTINATION_LIST_I18N.featured)}
              bookNowLabel={t(DESTINATION_LIST_I18N.bookNow)}
              saveLabel={t('common.saveDestination')}
              savedLabel={t('pages.home.trending.savedDestination', { city: hotel.name })}
              isSaved={savedHotelIds.has(hotel.id)}
              isSaving={savingHotelId === hotel.id}
              onBookNow={() => onBookNow(hotel.id)}
              onSave={() => void toggleFavourite(hotel.id)}
            />
          ))}
        </div>
      )}
      {modals}
    </section>
  )
}
