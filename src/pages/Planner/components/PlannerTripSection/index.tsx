import { useTranslation } from 'react-i18next'
import { PlannerAiBanner } from '@/components/common/PlannerAiBanner'
import { PlannerTripHero } from '@/components/common/PlannerTripHero'
import { useAppSelector } from '@/store/hooks'
import type { PlannerAiSource } from '@/store/planner/types'
import { EXPLORATION_CONTENT, PLANNER_I18N } from '../../const'
import { getExplorationContent } from '../../utils'

type PlannerTripSectionProps = {
  onShare: () => void
  onExportPdf: () => void
  onGenerateInsights: () => void
  isGenerating: boolean
}

const aiSourceBannerLabel = (
  aiSource: PlannerAiSource,
  t: (key: string) => string,
): string | null => {
  if (aiSource === 'gemini') {
    return t(PLANNER_I18N.ai.sourceGemini)
  }
  if (aiSource === 'demo') {
    return t(PLANNER_I18N.ai.sourceDemo)
  }
  return null
}

export const PlannerTripSection = ({
  onShare,
  onExportPdf,
  onGenerateInsights,
  isGenerating,
}: PlannerTripSectionProps) => {
  const { t } = useTranslation()
  const { activeExplorationId, aiSource } = useAppSelector((state) => state.planner)
  const exploration = getExplorationContent(activeExplorationId, EXPLORATION_CONTENT)

  return (
    <>
      <PlannerTripHero
        imageUrl={exploration.heroImage}
        eyebrow={t(exploration.trip.eyebrowKey)}
        title={t(exploration.trip.titleKey)}
        dates={t(exploration.trip.datesKey)}
        travelers={t(exploration.trip.travelersKey)}
        shareLabel={t(PLANNER_I18N.trip.share)}
        exportPdfLabel={t(PLANNER_I18N.trip.exportPdf)}
        onShare={onShare}
        onExportPdf={onExportPdf}
      />

      <PlannerAiBanner
        label={t(PLANNER_I18N.ai.label)}
        title={t(PLANNER_I18N.ai.title)}
        description={t(PLANNER_I18N.ai.description)}
        buttonLabel={t(PLANNER_I18N.ai.generate)}
        generatingLabel={t(PLANNER_I18N.ai.generating)}
        sourceLabel={aiSourceBannerLabel(aiSource, t)}
        isGenerating={isGenerating}
        onGenerate={onGenerateInsights}
      />
    </>
  )
}
