import { Pagination } from 'antd'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useHotels } from '@/hooks/useHotels'
import { useCountries, useCitiesByCountry } from '@/hooks/useLocations'
import { DestinationList } from './components/DestinationList'
import { FiltersSidebar } from './components/FiltersSidebar'
import { DESTINATIONS_I18N, PAGE_SIZE, PRICE_RANGE } from './const'
import type { SidebarFiltersState, StarRatingFilter } from './types'
import type { HotelType } from '@/types/hotel'
import styles from './styles.module.css'

const DestinationsPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
  const country = searchParams.get('country') ?? undefined
  const countryId = searchParams.get('countryId') ?? null
  const city = searchParams.get('city') ?? undefined
  const minPrice = Number(searchParams.get('minPrice') ?? PRICE_RANGE.min)
  const maxPrice = Number(searchParams.get('maxPrice') ?? PRICE_RANGE.max)
  const starRating = searchParams.get('starRating')
    ? (Number(searchParams.get('starRating')) as StarRatingFilter)
    : undefined
  const hotelType = (searchParams.get('hotelType') as HotelType) ?? undefined

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
  const { data: citiesData, isLoading: citiesLoading } = useCitiesByCountry(countryId)

  const countryOptions = useMemo(
    () => countriesData?.map((c) => ({ id: c.id, name: c.name })) ?? [],
    [countriesData],
  )

  const cityOptions = useMemo(() => citiesData?.map((c) => c.name) ?? [], [citiesData])

  const sidebarState: SidebarFiltersState = {
    priceRange: [minPrice, maxPrice],
    country: country ?? null,
    countryId,
    city: city ?? null,
    starRating: starRating ?? null,
    hotelType: hotelType ?? null,
  }

  const handleApplyFilters = useCallback(
    (applied: SidebarFiltersState) => {
      const next = new URLSearchParams()
      if (applied.country) next.set('country', applied.country)
      if (applied.countryId) next.set('countryId', applied.countryId)
      if (applied.city) next.set('city', applied.city)
      if (applied.priceRange[0] !== PRICE_RANGE.min)
        next.set('minPrice', String(applied.priceRange[0]))
      if (applied.priceRange[1] !== PRICE_RANGE.max)
        next.set('maxPrice', String(applied.priceRange[1]))
      if (applied.starRating) next.set('starRating', String(applied.starRating))
      if (applied.hotelType) next.set('hotelType', applied.hotelType)
      next.set('page', '1')
      setSearchParams(next, { replace: true })
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

      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <FiltersSidebar
            {...sidebarState}
            countryOptions={countryOptions}
            cityOptions={cityOptions}
            citiesLoading={citiesLoading}
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
