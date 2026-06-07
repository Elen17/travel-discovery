import { useState } from 'react'
import { StarFilled } from '@ant-design/icons'
import { Button, Checkbox, InputNumber, Select, Slider } from 'antd'
import { useTranslation } from 'react-i18next'
import { useCitiesByCountry } from '@/hooks/useLocations'
import type { HotelType } from '@/types/hotel'
import type { SidebarFiltersState, StarRatingFilter } from '@/pages/Destinations/types'
import { FILTER_I18N, FILTER_PRICE_RANGE, FILTER_STAR_RATINGS, HOTEL_TYPE_OPTIONS } from './const'
import { buildCityOptions, buildCountryOptions } from './utils'
import type { FiltersSidebarProps } from './types'
import styles from './styles.module.css'

export const FiltersSidebar = ({
  priceRange,
  country,
  countryId,
  city,
  starRating,
  hotelType,
  countryOptions,
  onApply,
}: FiltersSidebarProps) => {
  const { t } = useTranslation()

  const [draft, setDraft] = useState<SidebarFiltersState>({
    priceRange,
    country,
    countryId,
    city,
    starRating,
    hotelType,
  })

  const { data: citiesData, isLoading: citiesLoading } = useCitiesByCountry(draft.countryId)

  const cityOptions = citiesData?.map((c) => c.name) ?? []

  const handlePriceInput = (index: 0 | 1, value: number | null) => {
    if (value === null) return
    setDraft((prev) => {
      const next: [number, number] = [...prev.priceRange]
      next[index] = value
      if (next[0] > next[1]) next[index === 0 ? 1 : 0] = value
      return { ...prev, priceRange: next }
    })
  }

  const handleCountryChange = (value: string) => {
    const selected = countryOptions.find((c) => c.name === value)
    setDraft((prev) => ({
      ...prev,
      country: value === '' ? null : value,
      countryId: selected?.id ?? null,
      city: null,
    }))
  }

  const countrySelectOptions = buildCountryOptions(countryOptions, t(FILTER_I18N.allCountries))
  const citySelectOptions = buildCityOptions(cityOptions, t(FILTER_I18N.selectCity))

  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <span className={styles.label}>{t(FILTER_I18N.location)}</span>
        <div className={styles.selectGroup}>
          <Select
            className={styles.select}
            value={draft.country ?? ''}
            options={countrySelectOptions}
            onChange={handleCountryChange}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
          <Select
            className={styles.select}
            value={draft.city ?? ''}
            options={citySelectOptions}
            loading={citiesLoading}
            disabled={!draft.countryId}
            placeholder={citiesLoading ? t('common.loading') : t(FILTER_I18N.selectCity)}
            onChange={(value) =>
              setDraft((prev) => ({ ...prev, city: value === '' ? null : value }))
            }
          />
        </div>
      </div>
      <div className={styles.section}>
        <span className={styles.label}>{t(FILTER_I18N.priceRange)}</span>
        <div className={styles.priceInputs}>
          <div className={styles.priceField}>
            <span className={styles.priceFieldLabel}>{t(FILTER_I18N.min)}</span>
            <InputNumber
              className={styles.priceInput}
              prefix="$"
              controls={false}
              min={FILTER_PRICE_RANGE.min}
              max={FILTER_PRICE_RANGE.max}
              value={draft.priceRange[0]}
              onChange={(value) => handlePriceInput(0, value)}
            />
          </div>
          <div className={styles.priceField}>
            <span className={styles.priceFieldLabel}>{t(FILTER_I18N.max)}</span>
            <InputNumber
              className={styles.priceInput}
              prefix="$"
              controls={false}
              min={FILTER_PRICE_RANGE.min}
              max={FILTER_PRICE_RANGE.max}
              value={draft.priceRange[1]}
              onChange={(value) => handlePriceInput(1, value)}
            />
          </div>
        </div>
        <Slider
          range
          className={styles.slider}
          min={FILTER_PRICE_RANGE.min}
          max={FILTER_PRICE_RANGE.max}
          value={draft.priceRange}
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, priceRange: value as [number, number] }))
          }
        />
      </div>
      <div className={styles.section}>
        <span className={styles.label}>{t(FILTER_I18N.hotelType)}</span>
        <div className={styles.checkboxList}>
          {HOTEL_TYPE_OPTIONS.map(({ value, labelKey }) => (
            <Checkbox
              key={value}
              className={styles.checkbox}
              checked={draft.hotelType === value}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  hotelType: e.target.checked ? (value as HotelType) : null,
                }))
              }
            >
              {t(labelKey)}
            </Checkbox>
          ))}
        </div>
      </div>
      <div className={styles.section}>
        <span className={styles.label}>{t(FILTER_I18N.starRating)}</span>
        <div className={styles.checkboxList}>
          {FILTER_STAR_RATINGS.map((rating) => (
            <Checkbox
              key={rating}
              className={styles.starCheckbox}
              checked={draft.starRating === rating}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  starRating: e.target.checked ? (rating as StarRatingFilter) : null,
                }))
              }
            >
              <span className={styles.starRow} aria-hidden>
                {Array.from({ length: rating }, (_, i) => (
                  <StarFilled key={i} className={styles.starIcon} />
                ))}
              </span>
            </Checkbox>
          ))}
        </div>
      </div>

      <Button type="primary" className={styles.applyBtn} onClick={() => onApply(draft)}>
        {t(FILTER_I18N.apply)}
      </Button>
    </aside>
  )
}
