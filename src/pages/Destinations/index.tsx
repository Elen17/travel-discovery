import { Pagination } from 'antd'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { HotelListingCard } from '@/components/common/HotelListingCard'
import { DestinationsFilterBar } from '@/components/forms/DestinationsFilterBar'
import { formatCurrency } from '@/utils/currency'
import {
  DESTINATIONS_I18N,
  MOCK_LISTINGS,
  PAGE_SIZE,
  PRICE_RANGE,
} from './const'
import styles from './styles.module.css'
import type { DestinationAmenityFilter, DestinationFilters } from './types'
import { filterListings, paginateListings } from './utils'

const DestinationsPage = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const cityQuery = searchParams.get('city') ?? undefined
  const category = searchParams.get('category') ?? undefined
  const pageParam = Number(searchParams.get('page') ?? '1')
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1

  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_RANGE.min, PRICE_RANGE.max])
  const [selectedStarRating, setSelectedStarRating] = useState<number | null>(4)
  const [selectedAmenities, setSelectedAmenities] = useState<DestinationAmenityFilter[]>([])

  const filters: DestinationFilters = useMemo(
    () => ({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minStarRating: selectedStarRating,
      amenityFilters: selectedAmenities,
    }),
    [priceRange, selectedStarRating, selectedAmenities],
  )

  const filteredListings = useMemo(
    () => filterListings(MOCK_LISTINGS, filters, cityQuery, category),
    [filters, cityQuery, category],
  )

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)

  const pageListings = useMemo(
    () => paginateListings(filteredListings, safePage, PAGE_SIZE),
    [filteredListings, safePage],
  )

  const handlePageChange = (page: number) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(page))
    setSearchParams(next, { replace: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAmenityToggle = (amenity: DestinationAmenityFilter) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity],
    )
    handlePageChange(1)
  }

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range)
    handlePageChange(1)
  }

  const handleStarRatingChange = (rating: number | null) => {
    setSelectedStarRating(rating)
    handlePageChange(1)
  }

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>{t(DESTINATIONS_I18N.heroTitle)}</h1>
        <p className={styles.heroSubtitle}>{t(DESTINATIONS_I18N.heroSubtitle)}</p>
      </header>

      <div className={styles.filters}>
        <DestinationsFilterBar
          priceRange={priceRange}
          selectedStarRating={selectedStarRating}
          selectedAmenities={selectedAmenities}
          onPriceChange={handlePriceChange}
          onStarRatingChange={handleStarRatingChange}
          onAmenityToggle={handleAmenityToggle}
        />
      </div>

      {pageListings.length === 0 ? (
        <p className={styles.empty}>{t('pages.destinations.empty')}</p>
      ) : (
        <div className={styles.grid}>
          {pageListings.map((listing) => (
            <HotelListingCard
              key={listing.id}
              id={listing.id}
              name={listing.name}
              location={`${listing.city}, ${listing.country}`}
              priceLabel={formatCurrency(listing.pricePerNight, 'USD', i18n.language)}
              perNightLabel={t(DESTINATIONS_I18N.card.perNight)}
              guestRating={listing.guestRating}
              imageUrl={listing.imageUrl}
              isFeatured={listing.isFeatured}
              featuredLabel={t(DESTINATIONS_I18N.card.featured)}
              bookNowLabel={t(DESTINATIONS_I18N.card.bookNow)}
              saveLabel={t('common.saveDestination')}
              onBookNow={() => navigate(`/hotel/${listing.id}`)}
            />
          ))}
        </div>
      )}

      {filteredListings.length > PAGE_SIZE ? (
        <div className={styles.pagination}>
          <Pagination
            current={safePage}
            total={filteredListings.length}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      ) : null}
    </div>
  )
}

export default DestinationsPage
