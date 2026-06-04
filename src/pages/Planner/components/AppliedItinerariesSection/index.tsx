import { Button, List } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { removeAppliedItinerary } from '@/store/plannerSlice'
import { CATEGORY_I18N_KEYS, PLANNER_I18N } from '../../const'
import styles from '../../styles.module.css'

export const AppliedItinerariesSection = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { appliedItineraries } = useAppSelector((state) => state.planner)

  if (appliedItineraries.length === 0) {
    return null
  }

  return (
    <section className={styles.appliedSection} aria-labelledby="applied-heading">
      <h2 id="applied-heading" className={styles.sectionTitle}>
        {t(PLANNER_I18N.applied.title)}
      </h2>
      <List
        dataSource={appliedItineraries}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                key="remove"
                type="link"
                danger
                onClick={() => dispatch(removeAppliedItinerary(item.id))}
              >
                {t(PLANNER_I18N.applied.remove)}
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={item.title ?? t(item.titleKey)}
              description={`${t(CATEGORY_I18N_KEYS[item.category])} · ${item.duration ?? t(item.durationKey)}`}
            />
          </List.Item>
        )}
      />
    </section>
  )
}
