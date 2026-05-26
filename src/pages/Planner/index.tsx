import { message } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ItineraryPlanCard } from '@/components/common/ItineraryPlanCard'
import { PlannerAiBanner } from '@/components/common/PlannerAiBanner'
import { PlannerTripHero } from '@/components/common/PlannerTripHero'
import { PlannerSidebar } from '@/components/layout/PlannerSidebar'
import {
  ACTIVE_EXPLORATION_ID,
  CATEGORY_I18N_KEYS,
  PLANNER_I18N,
  RECENT_EXPLORATIONS,
  SUGGESTED_ITINERARIES,
  TRIP_HERO_IMAGE,
} from './const'
import styles from './styles.module.css'

const PlannerPage = () => {
  const { t } = useTranslation()
  const [activeExplorationId, setActiveExplorationId] = useState(ACTIVE_EXPLORATION_ID)
  const [messageApi, contextHolder] = message.useMessage()

  const showComingSoon = (feature: string) => {
    messageApi.info(t(PLANNER_I18N.comingSoon, { feature }))
  }

  return (
    <div className={styles.page}>
      {contextHolder}
      <PlannerSidebar
        explorations={RECENT_EXPLORATIONS}
        activeId={activeExplorationId}
        onSelect={setActiveExplorationId}
        onNewChat={() => showComingSoon(t(PLANNER_I18N.newChat))}
      />

      <main className={styles.main}>
        <PlannerTripHero
          imageUrl={TRIP_HERO_IMAGE}
          eyebrow={t(PLANNER_I18N.trip.eyebrow)}
          title={t(PLANNER_I18N.trip.title)}
          dates={t(PLANNER_I18N.trip.dates)}
          travelers={t(PLANNER_I18N.trip.travelers)}
          shareLabel={t(PLANNER_I18N.trip.share)}
          exportPdfLabel={t(PLANNER_I18N.trip.exportPdf)}
          onShare={() => showComingSoon(t(PLANNER_I18N.trip.share))}
          onExportPdf={() => showComingSoon(t(PLANNER_I18N.trip.exportPdf))}
        />

        <PlannerAiBanner
          label={t(PLANNER_I18N.ai.label)}
          title={t(PLANNER_I18N.ai.title)}
          description={t(PLANNER_I18N.ai.description)}
          buttonLabel={t(PLANNER_I18N.ai.generate)}
          onGenerate={() => showComingSoon(t(PLANNER_I18N.ai.generate))}
        />

        <section aria-labelledby="itineraries-heading">
          <div className={styles.sectionHeader}>
            <div>
              <h2 id="itineraries-heading" className={styles.sectionTitle}>
                {t(PLANNER_I18N.itineraries.title)}
              </h2>
              <p className={styles.sectionSubtitle}>{t(PLANNER_I18N.itineraries.subtitle)}</p>
            </div>
            <a href="#itineraries" className={styles.viewAll}>
              {t(PLANNER_I18N.itineraries.viewAll)}
            </a>
          </div>

          <div id="itineraries" className={styles.grid}>
            {SUGGESTED_ITINERARIES.map((item) => (
              <ItineraryPlanCard
                key={item.id}
                title={t(item.titleKey)}
                description={t(item.descriptionKey)}
                imageUrl={item.imageUrl}
                category={item.category}
                categoryLabel={t(CATEGORY_I18N_KEYS[item.category])}
                duration={t(item.durationKey)}
                usePlanLabel={t(PLANNER_I18N.itineraries.usePlan)}
                onUsePlan={() =>
                  showComingSoon(t(PLANNER_I18N.itineraries.usePlan))
                }
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default PlannerPage
