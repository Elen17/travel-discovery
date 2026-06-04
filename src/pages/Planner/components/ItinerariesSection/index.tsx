import { Button, Drawer, Modal } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SuggestedItinerary } from '@/types/planner'
import { ItineraryPlanCard } from '../../ItineraryPlanCard'
import { CATEGORY_I18N_KEYS, PLANNER_I18N } from '../../const'
import styles from '../../styles.module.css'

type ItinerariesSectionProps = {
  itineraries: SuggestedItinerary[]
  onUsePlan: (item: SuggestedItinerary) => void
}

export const ItinerariesSection = ({ itineraries, onUsePlan }: ItinerariesSectionProps) => {
  const { t } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [detailItinerary, setDetailItinerary] = useState<SuggestedItinerary | null>(null)

  const renderCard = (item: SuggestedItinerary, onUse?: () => void) => (
    <ItineraryPlanCard
      key={item.id}
      title={item.title ?? t(item.titleKey)}
      description={item.description ?? t(item.descriptionKey)}
      imageUrl={item.imageUrl}
      category={item.category}
      categoryLabel={t(CATEGORY_I18N_KEYS[item.category])}
      duration={item.duration ?? t(item.durationKey)}
      usePlanLabel={t(PLANNER_I18N.itineraries.usePlan)}
      onUsePlan={onUse ?? (() => onUsePlan(item))}
      onViewDetails={() => setDetailItinerary(item)}
    />
  )

  return (
    <>
      <section aria-labelledby="itineraries-heading">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="itineraries-heading" className={styles.sectionTitle}>
              {t(PLANNER_I18N.itineraries.title)}
            </h2>
            <p className={styles.sectionSubtitle}>
              {t(PLANNER_I18N.itineraries.subtitle)}
            </p>
          </div>
          <button
            type="button"
            className={styles.viewAll}
            onClick={() => setDrawerOpen(true)}
          >
            {t(PLANNER_I18N.itineraries.viewAll)}
          </button>
        </div>

        <div className={styles.grid}>
          {itineraries.map((item) => renderCard(item))}
        </div>
      </section>

      <Drawer
        title={t(PLANNER_I18N.drawer.title)}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={480}
      >
        <div className={styles.drawerGrid}>
          {itineraries.map((item) =>
            renderCard(item, () => {
              onUsePlan(item)
              setDrawerOpen(false)
            }),
          )}
        </div>
      </Drawer>

      <Modal
        title={detailItinerary ? (detailItinerary.title ?? t(detailItinerary.titleKey)) : ''}
        open={detailItinerary !== null}
        onCancel={() => setDetailItinerary(null)}
        footer={[
          <Button key="close" onClick={() => setDetailItinerary(null)}>
            {t(PLANNER_I18N.drawer.close)}
          </Button>,
          detailItinerary && (
            <Button
              key="use"
              type="primary"
              onClick={() => {
                onUsePlan(detailItinerary)
                setDetailItinerary(null)
              }}
            >
              {t(PLANNER_I18N.itineraries.usePlan)}
            </Button>
          ),
        ]}
      >
        {detailItinerary && (
          <>
            <p>{detailItinerary.description ?? t(detailItinerary.descriptionKey)}</p>
            {(detailItinerary.steps ?? detailItinerary.stepKeys)?.length ? (
              <>
                <h3 className={styles.stepsTitle}>{t(PLANNER_I18N.drawer.steps)}</h3>
                <ol className={styles.stepsList}>
                  {detailItinerary.steps?.map((step) => (
                    <li key={step}>{step}</li>
                  )) ??
                    detailItinerary.stepKeys?.map((stepKey) => (
                      <li key={stepKey}>{t(stepKey)}</li>
                    ))}
                </ol>
              </>
            ) : null}
          </>
        )}
      </Modal>
    </>
  )
}
