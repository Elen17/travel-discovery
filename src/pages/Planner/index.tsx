import { Alert, Button, Drawer, List, Modal, Skeleton } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { ItineraryPlanCard } from '@/components/common/ItineraryPlanCard'
import { PlannerAiBanner } from '@/components/common/PlannerAiBanner'
import { PlannerTripHero } from '@/components/common/PlannerTripHero'
import { PlannerSidebar } from '@/components/layout/PlannerSidebar'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  applyItinerary,
  hydrateFromUrl,
  removeAppliedItinerary,
  setActiveExploration,
  setDynamicItineraries,
  setDynamicSuggestions,
  setHydrated,
  setMessages,
  setOfflineMode,
  setSessionToken,
  startNewChat,
} from '@/store/plannerSlice'
import type { AppliedItinerary, ExplorationId, SuggestedItinerary } from '@/types/planner'
import {
  CATEGORY_I18N_KEYS,
  EXPLORATION_CONTENT,
  PLANNER_I18N,
  RECENT_EXPLORATIONS,
} from './const'
import { usePlannerChat, usePlannerHistory } from './hooks'
import styles from './styles.module.css'
import {
  buildGenerateInsightsPrompt,
  buildHotelContextPrompt,
  buildShareUrl,
  downloadTripPlanPdf,
  getExplorationContent,
  parsePlannerSearchParams,
  resolveExplorationFromParams,
  suggestionsToItineraries,
} from './utils'

const PlannerPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [detailItinerary, setDetailItinerary] = useState<SuggestedItinerary | null>(null)
  const [shareMessage, setShareMessage] = useState<string | null>(null)
  const hasSentContextRef = useRef(false)

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const {
    activeExplorationId,
    sessionToken,
    messages,
    appliedItineraries,
    dynamicItineraries,
    isHydrated,
  } = useAppSelector((state) => state.planner)

  const exploration = getExplorationContent(activeExplorationId, EXPLORATION_CONTENT)
  const { sendMessage } = usePlannerChat(activeExplorationId)

  const { data: historyMessages } = usePlannerHistory({
    sessionToken,
    enabled: isAuthenticated && Boolean(sessionToken),
  })

  const displayedItineraries = useMemo(
    () => dynamicItineraries ?? exploration.suggestedItineraries,
    [dynamicItineraries, exploration.suggestedItineraries],
  )

  useEffect(() => {
    const parsed = parsePlannerSearchParams(searchParams)
    const explorationId = resolveExplorationFromParams(parsed)
    dispatch(
      hydrateFromUrl({
        explorationId,
        sessionToken: parsed.session,
      }),
    )
    dispatch(setHydrated(true))
  }, [dispatch, searchParams])

  useEffect(() => {
    if (historyMessages && historyMessages.length > 0) {
      dispatch(setMessages(historyMessages))
    }
  }, [dispatch, historyMessages])

  useEffect(() => {
    if (shareMessage) {
      const timer = window.setTimeout(() => setShareMessage(null), 3000)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [shareMessage])

  const handleSelectExploration = useCallback(
    (id: string) => {
      dispatch(setActiveExploration(id as ExplorationId))
    },
    [dispatch],
  )

  const handleChatSend = useCallback(
    async (message: string) => {
      const userMessage = { role: 'user' as const, content: message }
      dispatch(setMessages([...messages, userMessage]))

      try {
        const response = await sendMessage({
          message,
          sessionToken: sessionToken ?? undefined,
        })

        dispatch(setSessionToken(response.sessionToken))
        dispatch(
          setMessages([
            ...messages,
            userMessage,
            { role: 'assistant', content: response.reply },
          ]),
        )

        if (response.suggestions) {
          dispatch(setDynamicSuggestions(response.suggestions))
          dispatch(
            setDynamicItineraries(
              suggestionsToItineraries(response.suggestions, activeExplorationId),
            ),
          )
        }

        dispatch(setOfflineMode(response.fromMock))
      } catch {
        dispatch(setOfflineMode(true))
      }
    },
    [activeExplorationId, dispatch, messages, sendMessage, sessionToken],
  )

  const handleGenerateInsights = useCallback(() => {
    void handleChatSend(buildGenerateInsightsPrompt(activeExplorationId))
  }, [activeExplorationId, handleChatSend])

  useEffect(() => {
    if (hasSentContextRef.current || !isHydrated) {
      return
    }
    const parsed = parsePlannerSearchParams(searchParams)
    if (parsed.hotelName && parsed.destination && messages.length === 0) {
      hasSentContextRef.current = true
      void handleChatSend(
        buildHotelContextPrompt(parsed.hotelName, parsed.destination),
      )
    }
  }, [handleChatSend, isHydrated, messages.length, searchParams])

  const handleNewChat = useCallback(() => {
    dispatch(startNewChat())
  }, [dispatch])

  const handleUsePlan = useCallback(
    (item: SuggestedItinerary) => {
      const applied: AppliedItinerary = {
        id: item.id,
        titleKey: item.titleKey,
        title: item.title,
        durationKey: item.durationKey,
        duration: item.duration,
        category: item.category,
        appliedAt: new Date().toISOString(),
      }
      dispatch(applyItinerary(applied))
      setShareMessage(t(PLANNER_I18N.applied.added))
    },
    [dispatch, t],
  )

  const handleShare = useCallback(async () => {
    const token = sessionToken ?? `share_${activeExplorationId}_${Date.now()}`
    if (!sessionToken) {
      dispatch(setSessionToken(token))
    }
    const url = buildShareUrl(token, activeExplorationId)

    if (navigator.share) {
      try {
        await navigator.share({
          title: t(exploration.trip.titleKey),
          url,
        })
        return
      } catch {
        // fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setShareMessage(t(PLANNER_I18N.share.copied))
    } catch {
      setShareMessage(t(PLANNER_I18N.share.failed))
    }
  }, [activeExplorationId, dispatch, exploration.trip.titleKey, sessionToken, t])

  const handleExportPdf = useCallback(() => {
    downloadTripPlanPdf({
      documentTitle: t(PLANNER_I18N.print.title),
      tripTitle: t(exploration.trip.titleKey),
      tripDates: t(exploration.trip.datesKey),
      tripTravelers: t(exploration.trip.travelersKey),
      appliedSectionTitle: t(PLANNER_I18N.applied.title),
      appliedItems: appliedItineraries.map((item) => ({
        title: item.title ?? t(item.titleKey),
        meta: `${t(CATEGORY_I18N_KEYS[item.category])} · ${item.duration ?? t(item.durationKey)}`,
      })),
      itinerariesSectionTitle: t(PLANNER_I18N.itineraries.title),
      itinerariesSubtitle: t(PLANNER_I18N.itineraries.subtitle),
      itineraries: displayedItineraries.map((item) => ({
        title: item.title ?? t(item.titleKey),
        description: item.description ?? t(item.descriptionKey),
        category: t(CATEGORY_I18N_KEYS[item.category]),
        duration: item.duration ?? t(item.durationKey),
        stepsLabel: t(PLANNER_I18N.drawer.steps),
        steps: item.steps ?? item.stepKeys?.map((stepKey) => t(stepKey)) ?? [],
      })),
      filenameBase: t(exploration.trip.titleKey),
    })
  }, [t, exploration, appliedItineraries, displayedItineraries])

  const handleRemoveApplied = useCallback(
    (id: string) => {
      dispatch(removeAppliedItinerary(id))
    },
    [dispatch],
  )

  if (!isHydrated) {
    return (
      <div className={styles.page}>
        <div className={styles.skeletonSidebar}>
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
        <main className={styles.main}>
          <Skeleton.Image active className={styles.skeletonHero} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </main>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <PlannerSidebar
        explorations={RECENT_EXPLORATIONS}
        activeId={activeExplorationId}
        onSelect={handleSelectExploration}
        onNewChat={handleNewChat}
      />

      <main className={styles.main}>
        {shareMessage && (
          <Alert
            message={shareMessage}
            type="success"
            showIcon
            closable
            className={styles.alert}
            onClose={() => setShareMessage(null)}
          />
        )}

        <div className={styles.tripColumn}>
            <PlannerTripHero
              imageUrl={exploration.heroImage}
              eyebrow={t(exploration.trip.eyebrowKey)}
              title={t(exploration.trip.titleKey)}
              dates={t(exploration.trip.datesKey)}
              travelers={t(exploration.trip.travelersKey)}
              shareLabel={t(PLANNER_I18N.trip.share)}
              exportPdfLabel={t(PLANNER_I18N.trip.exportPdf)}
              onShare={() => void handleShare()}
              onExportPdf={handleExportPdf}
            />

            <PlannerAiBanner
              label={t(PLANNER_I18N.ai.label)}
              title={t(PLANNER_I18N.ai.title)}
              description={t(PLANNER_I18N.ai.description)}
              buttonLabel={t(PLANNER_I18N.ai.generate)}
              onGenerate={handleGenerateInsights}
            />

            {appliedItineraries.length > 0 && (
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
                          onClick={() => handleRemoveApplied(item.id)}
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
            )}

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
                {displayedItineraries.map((item) => (
                  <ItineraryPlanCard
                    key={item.id}
                    title={item.title ?? t(item.titleKey)}
                    description={item.description ?? t(item.descriptionKey)}
                    imageUrl={item.imageUrl}
                    category={item.category}
                    categoryLabel={t(CATEGORY_I18N_KEYS[item.category])}
                    duration={item.duration ?? t(item.durationKey)}
                    usePlanLabel={t(PLANNER_I18N.itineraries.usePlan)}
                    onUsePlan={() => handleUsePlan(item)}
                    onViewDetails={() => setDetailItinerary(item)}
                  />
                ))}
              </div>
            </section>
        </div>
      </main>

      <Drawer
        title={t(PLANNER_I18N.drawer.title)}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={480}
      >
        <div className={styles.drawerGrid}>
          {displayedItineraries.map((item) => (
            <ItineraryPlanCard
              key={item.id}
              title={item.title ?? t(item.titleKey)}
              description={item.description ?? t(item.descriptionKey)}
              imageUrl={item.imageUrl}
              category={item.category}
              categoryLabel={t(CATEGORY_I18N_KEYS[item.category])}
              duration={item.duration ?? t(item.durationKey)}
              usePlanLabel={t(PLANNER_I18N.itineraries.usePlan)}
              onUsePlan={() => {
                handleUsePlan(item)
                setDrawerOpen(false)
              }}
              onViewDetails={() => {
                setDetailItinerary(item)
                setDrawerOpen(false)
              }}
            />
          ))}
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
                handleUsePlan(detailItinerary)
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
    </div>
  )
}

export default PlannerPage
