export type PlannerAiBannerProps = {
  label: string
  title: string
  description: string
  buttonLabel: string
  generatingLabel: string
  sourceLabel?: string | null
  isGenerating?: boolean
  onGenerate?: () => void
}
