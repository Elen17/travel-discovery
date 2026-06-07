import { Pagination } from 'antd'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useHotels } from '@/hooks/useHotels'
import { useCountries } from '@/hooks/useLocations'
import { DestinationList } from './components/DestinationList'
import { HotelsMap } from './components/HotelsMap'
import { FiltersSidebar } from './components/FiltersSidebar'
import { DESTINATIONS_I18N, PAGE_SIZE, PRICE_RANGE } from './const'
import type { SidebarFiltersState } from './types'
import { parseFiltersFromParams, buildSearchParams } from './utils'
import styles from './styles.module.css'

const DestinationsPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const { page, country, countryId, city, minPrice, maxPrice, starRating, hotelType } =
    parseFiltersFromParams(searchParams)

  const { data, isLoading, isError } = useHotels({
    page: page - 1,
    size: PAGE_SIZE,
    country,
    city,
    minPrice: minPrice !== PRICE_RANGE.min ? minPrice : undefined,
    maxPrice: maxPrice !== PRICE_RANGE.max ? maxPrice : undefined,
    starRating,
    type: hotelType,
  })

  const { data: countriesData } = useCountries()

  const countryOptions = useMemo(
    () => countriesData?.map((c) => ({ id: c.id, name: c.name })) ?? [],
    [countriesData],
  )

  const sidebarState: SidebarFiltersState = useMemo(
    () => ({
      priceRange: [minPrice, maxPrice],
      country: country ?? null,
      countryId,
      city: city ?? null,
      starRating: starRating ?? null,
      hotelType: hotelType ?? null,
    }),
    [minPrice, maxPrice, country, countryId, city, starRating, hotelType],
  )

  const handleApplyFilters = useCallback(
    (applied: SidebarFiltersState) => {
      setSearchParams(buildSearchParams(applied, PRICE_RANGE), { replace: true })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [setSearchParams],
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      const next = new URLSearchParams(searchParams)
      next.set('page', String(newPage))
      setSearchParams(next, { replace: true })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [searchParams, setSearchParams],
  )

  const handleBookNow = useCallback((hotelId: number) => navigate(`/hotel/${hotelId}`), [navigate])

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>{t(DESTINATIONS_I18N.heroTitle)}</h1>
        <p className={styles.heroSubtitle}>{t(DESTINATIONS_I18N.heroSubtitle)}</p>
      </header>
      <HotelsMap hotels={data?.content ?? []} />

      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <FiltersSidebar
            {...sidebarState}
            countryOptions={countryOptions}
            onApply={handleApplyFilters}
          />
        </div>

        <div className={styles.main}>
          {isError ? (
            <p className={styles.error}>{t('common.errorLoading')}</p>
          ) : (
            <DestinationList
              hotels={data?.content ?? []}
              totalResults={data?.totalElements ?? 0}
              isLoading={isLoading}
              onBookNow={handleBookNow}
            />
          )}

          {data && data.totalElements > PAGE_SIZE && (
            <div className={styles.pagination}>
              <Pagination
                current={page}
                total={data.totalElements}
                pageSize={PAGE_SIZE}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DestinationsPage
