import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { PAGE_PLACEHOLDER_TEST_ID } from './const'
import styles from './styles.module.css'
import type { PagePlaceholderProps } from './types'

const { Title, Paragraph } = Typography

export const PagePlaceholder = ({ titleKey, descriptionKey }: PagePlaceholderProps) => {
  const { t } = useTranslation()

  return (
    <section className={styles.container} data-testid={PAGE_PLACEHOLDER_TEST_ID}>
      <Title level={2} className={styles.title}>
        {t(titleKey)}
      </Title>
      <Paragraph className={styles.description}>{t(descriptionKey)}</Paragraph>
    </section>
  )
}
