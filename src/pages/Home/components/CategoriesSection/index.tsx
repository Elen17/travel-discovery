import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { CategoryCard } from '@/components/common/CategoryCard'
import { HOME_CATEGORIES, HOME_I18N } from '@/pages/Home/const'
import { SectionHeader } from '../SectionHeader'
import styles from './styles.module.css'

export const CategoriesSection = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <section className={styles.section} aria-labelledby="categories-heading">
      <SectionHeader
        centered
        titleId="categories-heading"
        eyebrow={t(HOME_I18N.categories.eyebrow)}
        title={t(HOME_I18N.categories.title)}
      />
      <div className={styles.categoryGrid}>
        {HOME_CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            label={t(category.labelKey)}
            icon={category.icon}
            onClick={() => navigate(`/destinations?category=${category.id}`)}
          />
        ))}
      </div>
    </section>
  )
}
