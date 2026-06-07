import { CategoriesSection } from './components/CategoriesSection'
import { HeroSection } from './components/HeroSection'
import { NewsletterSubscribe } from './components/NewsletterSubscribe'
import { TrendingSection } from './components/TrendingSection'
import styles from './styles.module.css'

const HomePage = () => {
  return (
    <div className={styles.page}>
      <HeroSection />
      <CategoriesSection />
      <TrendingSection />
      <section className={styles.section}>
        <NewsletterSubscribe />
      </section>
    </div>
  )
}

export default HomePage
