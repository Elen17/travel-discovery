import { GlobalOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '@/i18n'
import { LANGUAGE_LABELS } from './const'
import type { LanguageSwitcherProps } from './types'

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { i18n, t } = useTranslation()

  const items = SUPPORTED_LANGUAGES.map((lng) => ({
    key: lng,
    label: LANGUAGE_LABELS[lng],
    onClick: () => {
      void i18n.changeLanguage(lng)
    },
  }))

  return (
    <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
      <Button
        type="text"
        className={className}
        icon={<GlobalOutlined />}
        aria-label={t('common.language')}
      >
        {LANGUAGE_LABELS[i18n.language as keyof typeof LANGUAGE_LABELS] ?? 'EN'}
      </Button>
    </Dropdown>
  )
}
