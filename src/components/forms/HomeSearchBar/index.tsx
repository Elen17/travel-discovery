import { Button, DatePicker, Form, Input, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { GUEST_OPTIONS, SEARCH_I18N } from './const'
import styles from './styles.module.css'
import type { HomeSearchBarProps, HomeSearchBarValues } from './types'

const { RangePicker } = DatePicker

export const HomeSearchBar = ({ onSearch }: HomeSearchBarProps) => {
  const { t } = useTranslation()
  const [form] = Form.useForm<HomeSearchBarValues>()

  const handleFinish = (values: HomeSearchBarValues) => {
    onSearch?.(values)
  }

  return (
    <Form
      form={form}
      className={styles.searchBar}
      onFinish={handleFinish}
      layout="inline"
      requiredMark={false}
    >
      <div className={styles.field}>
        <span className={styles.label}>{t(SEARCH_I18N.destination)}</span>
        <Form.Item name="destination" noStyle>
          <Input
            className={styles.input}
            placeholder={t(SEARCH_I18N.destinationPlaceholder)}
            bordered={false}
            aria-label={t(SEARCH_I18N.destination)}
          />
        </Form.Item>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>{t(SEARCH_I18N.dates)}</span>
        <Form.Item name="dates" noStyle>
          <RangePicker
            className={styles.input}
            placeholder={[t(SEARCH_I18N.datesPlaceholder), t(SEARCH_I18N.datesPlaceholder)]}
            bordered={false}
            aria-label={t(SEARCH_I18N.dates)}
          />
        </Form.Item>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>{t(SEARCH_I18N.guests)}</span>
        <Form.Item name="guests" noStyle>
          <Select
            className={styles.input}
            placeholder={t(SEARCH_I18N.guestsPlaceholder)}
            bordered={false}
            allowClear
            options={GUEST_OPTIONS.map((n) => ({ value: n, label: String(n) }))}
            aria-label={t(SEARCH_I18N.guests)}
          />
        </Form.Item>
      </div>

      <div className={styles.submitWrap}>
        <Button type="primary" htmlType="submit" className={styles.submitBtn}>
          {t(SEARCH_I18N.submit)}
        </Button>
      </div>
    </Form>
  )
}

export type { HomeSearchBarValues }
