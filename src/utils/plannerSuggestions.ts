import type { PlannerSuggestion } from '@/types/planner'

const VALID_CATEGORIES = new Set<PlannerSuggestion['category']>(['nature', 'wellness', 'adventure'])

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'suggestion'

export const parseSuggestionsFromText = (text: string): PlannerSuggestion[] | undefined => {
  const match = text.match(/```json\s*([\s\S]*?)\s*```/i)
  if (!match?.[1]) {
    return undefined
  }

  try {
    const parsed = JSON.parse(match[1]) as { suggestions?: unknown }
    if (!Array.isArray(parsed.suggestions)) {
      return undefined
    }

    const suggestions = parsed.suggestions.flatMap((item, index): PlannerSuggestion[] => {
      if (typeof item !== 'object' || item === null) {
        return []
      }

      const title = 'title' in item && typeof item.title === 'string' ? item.title : null
      if (!title) {
        return []
      }

      const rawCategory = 'category' in item && typeof item.category === 'string' ? item.category : 'nature'
      const category = VALID_CATEGORIES.has(rawCategory as PlannerSuggestion['category'])
        ? (rawCategory as PlannerSuggestion['category'])
        : 'nature'

      const rawId = 'id' in item && typeof item.id === 'string' ? item.id : slugify(title)
      const duration = 'duration' in item && typeof item.duration === 'string' ? item.duration : '4 Hours'
      const description =
        'description' in item && typeof item.description === 'string' ? item.description : undefined
      const rawSteps = 'steps' in item && Array.isArray(item.steps) ? item.steps : undefined
      const steps = rawSteps?.filter((step: unknown): step is string => typeof step === 'string')

      return [
        {
          id: rawId || `suggestion-${index + 1}`,
          title,
          category,
          duration,
          description,
          steps,
        },
      ]
    })

    return suggestions.length > 0 ? suggestions : undefined
  } catch {
    return undefined
  }
}
