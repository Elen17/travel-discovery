import { useQuery } from '@tanstack/react-query'
import { Button, DatePicker, Form, Select } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getCountriesWithCities } from '@/api/locations'
import { GUEST_OPTIONS, LOCATIONS_QUERY_KEY, SEARCH_I18N } from './const'
import styles from './styles.module.css'
import type { HomeSearchBarProps, HomeSearchBarValues } from './types'
import { trackSearch } from '@/services/analytics'

const { RangePicker } = DatePicker

export const HomeSearchBar = ({ onSearch, loading = false }: HomeSearchBarProps) => {
  const { t } = useTranslation()
  const [form] = Form.useForm<HomeSearchBarValues>()
  const selectedCountry = Form.useWatch('country', form)

  const { data: countries = [], isLoading } = useQuery({
    queryKey: LOCATIONS_QUERY_KEY,
    queryFn: getCountriesWithCities,
  })

  const countryOptions = useMemo(
    () => countries.map((country) => ({ value: country.name, label: country.name })),
    [countries],
  )

  const cityOptions = useMemo(() => {
    const country = countries.find((item) => item.name === selectedCountry)
    return (country?.cities ?? []).map((city) => ({
      value: city.name,
      label: city.name,
    }))
  }, [countries, selectedCountry])

  const handleCountryChange = () => {
    form.setFieldValue('city', null)
  }

  const handleFinish = async (values: HomeSearchBarValues) => {
    if (values.country?.trim() && values.city?.trim()) {
        trackSearch(values.country?.trim() + ' ' + values.city?.trim())
    }
    await onSearch?.(values)
  }

  return (
    <div className={styles.searchWrapper}>
      <Form
        form={form}
        className={styles.searchBar}
        onFinish={handleFinish}
        layout="inline"
        requiredMark={false}
        initialValues={{
          country: null,
          city: null,
          dates: null,
          guests: null,
        }}
      >
      <div className={styles.field}>
        <div className={styles.fieldBody}>
          <span className={styles.label}>{t(SEARCH_I18N.country)}</span>
          <Form.Item
            name="country"
            className={styles.formItem}
            rules={[{ required: true, message: t(SEARCH_I18N.errors.countryRequired) }]}
          >
            <Select
              className={styles.input}
              placeholder={t(SEARCH_I18N.countryPlaceholder)}
              variant="borderless"
              allowClear
              showSearch
              optionFilterProp="label"
              loading={isLoading}
              options={countryOptions}
              onChange={handleCountryChange}
              aria-label={t(SEARCH_I18N.country)}
            />
          </Form.Item>
        </div>
      </div>

      <div className={styles.field}>
        <div className={styles.fieldBody}>
          <span className={styles.label}>{t(SEARCH_I18N.city)}</span>
          <Form.Item
            name="city"
            className={styles.formItem}
            rules={[{ required: true, message: t(SEARCH_I18N.errors.cityRequired) }]}
          >
            <Select
              className={styles.input}
              placeholder={t(SEARCH_I18N.cityPlaceholder)}
              variant="borderless"
              allowClear
              showSearch
              optionFilterProp="label"
              disabled={!selectedCountry || isLoading}
              options={cityOptions}
              aria-label={t(SEARCH_I18N.city)}
            />
          </Form.Item>
        </div>
      </div>

      <div className={`${styles.field} ${styles.fieldDates}`}>
        <div className={styles.fieldBody}>
          <span className={styles.label}>{t(SEARCH_I18N.dates)}</span>
          <Form.Item name="dates" className={styles.formItem}>
            <RangePicker
              className={styles.input}
              placeholder={[t(SEARCH_I18N.startDatesPlaceholder), t(SEARCH_I18N.endDatesPlaceholder)]}
              variant="borderless"
              aria-label={t(SEARCH_I18N.dates)}
            />
          </Form.Item>
        </div>
      </div>

      <div className={`${styles.field} ${styles.fieldGuests}`}>
        <div className={styles.fieldBody}>
          <span className={styles.label}>{t(SEARCH_I18N.guests)}</span>
          <Form.Item name="guests" className={styles.formItem}>
            <Select
              className={styles.input}
              placeholder={t(SEARCH_I18N.guestsPlaceholder)}
              variant="borderless"
              allowClear
              options={GUEST_OPTIONS.map((n) => ({ value: n, label: String(n) }))}
              aria-label={t(SEARCH_I18N.guests)}
            />
          </Form.Item>
        </div>
      </div>

      <div className={styles.submitWrap}>
        <Button type="primary" htmlType="submit" className={styles.submitBtn} loading={loading}>
          {t(SEARCH_I18N.submit)}
        </Button>
      </div>
    </Form>
    </div>
  )
}

export type { HomeSearchBarValues }
