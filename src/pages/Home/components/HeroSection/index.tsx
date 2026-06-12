import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { searchHotelsLive } from '@/api/hotels'
import { HOME_I18N } from '@/pages/Home/const'
import { buildDestinationsSearchParams, buildHotelLiveSearchParams } from '@/pages/Home/utils'
import { useAppDispatch } from '@/store/hooks'
import { setLiveSearchParams, setLiveSearchResults } from '@/store/searchSlice'
import type { HomeSearchBarValues } from '../HomeSearchBar'
import { HomeSearchBar } from '../HomeSearchBar'
import styles from './styles.module.css'

export const HeroSection = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSearch = async (values: HomeSearchBarValues) => {
    const liveParams = buildHotelLiveSearchParams(values)
    if (!liveParams) {
      return
    }

    setLoading(true)
    setErrorMessage(null)

    try {
      dispatch(setLiveSearchParams(liveParams))
      const hotels = await searchHotelsLive(liveParams)
      dispatch(setLiveSearchResults(hotels))

      const query = buildDestinationsSearchParams(values).toString()
      navigate(query ? `/destinations?${query}` : '/destinations')
    } catch {
      setErrorMessage(t(HOME_I18N.search.errors.generic))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      className={styles.hero}
      aria-label={t(HOME_I18N.heroTitle)}
    >
      <span className={styles.heroOverlay} aria-hidden />
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>{t(HOME_I18N.heroTitle)}</h1>
        <HomeSearchBar onSearch={handleSearch} loading={loading} />
        {errorMessage ? (
          <p className={styles.searchError} role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </section>
  )
}
