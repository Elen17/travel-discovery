import axios, { isAxiosError } from 'axios'
import { PLANNER_AI_SYSTEM_RULES } from '@/pages/Planner/plannerRulesPrompt'
import type { ExplorationId, PlannerSuggestion } from '@/types/planner'

export type TravelPreferences = {
  city: string
  weather: string
  timeOfDay: string
  interests: string[]
}

export type TravelSuggestion = {
  title: string
  description: string
  whyItFits: string
}

export type GeminiPlannerReply = {
  reply: string
  suggestions?: PlannerSuggestion[]
}

export type GeminiQuotaError = {
  code: 'GEMINI_QUOTA_EXCEEDED'
  status: number
  model: string | null
  message: string
  retryAfterSeconds: number | null
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim() ?? ''
const GEMINI_MODEL =
  import.meta.env.VITE_GEMINI_MODEL?.trim() || 'gemini-2.5-flash'

const DEFAULT_GEMINI_API_ROOT = 'https://generativelanguage.googleapis.com/v1beta/models'

const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash-lite'] as const

/** Supports base URL only, or legacy full `…/models/{model}:generateContent` in VITE_GEMINI_API_URL. */
const buildGeminiGenerateUrl = (model: string): string => {
  const rawUrl = import.meta.env.VITE_GEMINI_API_URL?.trim()

  if (!rawUrl) {
    return `${DEFAULT_GEMINI_API_ROOT}/${model}:generateContent?key=${API_KEY}`
  }

  const withoutKey = rawUrl.replace(/\?.*$/, '').replace(/\/$/, '')

  if (withoutKey.includes(':generateContent')) {
    const withModel = withoutKey.replace(
      /\/models\/[^:]+:generateContent$/i,
      `/models/${model}:generateContent`,
    )
    return `${withModel}?key=${API_KEY}`
  }

  if (/\/models\/[^/]+$/i.test(withoutKey)) {
    const withModel = withoutKey.replace(/\/models\/[^/]+$/i, `/models/${model}`)
    return `${withModel}:generateContent?key=${API_KEY}`
  }

  return `${withoutKey}/${model}:generateContent?key=${API_KEY}`
}

const modelsToTry = (): string[] => {
  const ordered = [GEMINI_MODEL, ...FALLBACK_MODELS]
  return [...new Set(ordered)]
}

const VALID_CATEGORIES = new Set<PlannerSuggestion['category']>(['nature', 'wellness', 'adventure'])

const isInsightsRequest = (message: string): boolean => {
  const lower = message.toLowerCase()
  return (
    lower.includes('generate insights') ||
    lower.includes('suggest') ||
    lower.includes('itinerar') ||
    lower.includes('day plan')
  )
}

const buildPlannerPrompt = (userMessage: string, explorationId: ExplorationId): string => {
  const destinationContext = `Current trip destination: ${explorationId}.`
  const userContext = `${destinationContext}\n\nUser message:\n${userMessage}`

  if (!isInsightsRequest(userMessage)) {
    return `${PLANNER_AI_SYSTEM_RULES}\n\n${userContext}`
  }

  return `${PLANNER_AI_SYSTEM_RULES}

${userContext}

The user requested curated day plans. Reply with a brief conversational summary, then include exactly 3 itinerary suggestions and end with a fenced JSON block:

\`\`\`json
{"suggestions":[{"id":"unique-slug","title":"Activity name","category":"nature|wellness|adventure","duration":"4 Hours","description":"Brief description","steps":["Step one","Step two"]}]}
\`\`\``
}

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'suggestion'

const parseSuggestions = (text: string): PlannerSuggestion[] | undefined => {
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

const stripJsonBlock = (text: string): string =>
  text.replace(/```json[\s\S]*?```/gi, '').trim()

const parseRetryAfterSeconds = (message: string): number | null => {
  const match = message.match(/retry in ([\d.]+)s/i)
  if (!match?.[1]) {
    return null
  }
  const seconds = Number.parseFloat(match[1])
  return Number.isFinite(seconds) ? Math.ceil(seconds) : null
}

const parseModelFromQuotaMessage = (message: string): string | null => {
  const match = message.match(/model:\s*([^\s\n]+)/i)
  return match?.[1] ?? null
}

const hasZeroFreeTierLimit = (message: string): boolean =>
  /limit:\s*0/i.test(message) && /free_tier/i.test(message)

const isHighDemandMessage = (message: string): boolean =>
  /high demand|try again later|overloaded|resource exhausted|temporarily unavailable/i.test(
    message,
  )

const getGeminiApiMessage = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return ''
  }
  const message = error.response?.data?.error?.message
  return typeof message === 'string' ? message : ''
}

const isRetriableGeminiError = (error: unknown): boolean => {
  if (!isAxiosError(error)) {
    return false
  }
  const status = error.response?.status
  if (status === 429 || status === 503 || status === 500 || status === 502) {
    return true
  }
  return isHighDemandMessage(getGeminiApiMessage(error))
}

const toGeminiQuotaError = (status: number, message: string): GeminiQuotaError => {
  const model = parseModelFromQuotaMessage(message)
  const retryAfterSeconds = parseRetryAfterSeconds(message)
  const zeroLimit = hasZeroFreeTierLimit(message)
  const highDemand = isHighDemandMessage(message)

  const guidance = zeroLimit
    ? `Free-tier quota for ${model ?? GEMINI_MODEL} is 0. Use VITE_GEMINI_MODEL=gemini-2.5-flash, or rely on the backend planner (mock fallback when unavailable).`
    : highDemand
      ? 'The model is busy. The app will retry automatically or use the built-in planner fallback.'
      : retryAfterSeconds
        ? `Rate limit reached. Retry in about ${retryAfterSeconds}s, or use the backend planner.`
        : 'Gemini quota exceeded. Use the backend planner or check https://ai.dev/rate-limit.'

  return {
    code: 'GEMINI_QUOTA_EXCEEDED',
    status,
    model,
    message: `${message.trim()}\n\n${guidance}`,
    retryAfterSeconds,
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const extractGeminiText = (data: unknown): string | null => {
  if (typeof data !== 'object' || data === null) {
    return null
  }
  const candidates = 'candidates' in data ? data.candidates : undefined
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return null
  }
  const first = candidates[0]
  if (typeof first !== 'object' || first === null) {
    return null
  }
  const content = 'content' in first ? first.content : undefined
  if (typeof content !== 'object' || content === null) {
    return null
  }
  const parts = 'parts' in content ? content.parts : undefined
  if (!Array.isArray(parts) || parts.length === 0) {
    return null
  }
  const textPart = parts[0]
  if (typeof textPart !== 'object' || textPart === null) {
    return null
  }
  const text = 'text' in textPart ? textPart.text : undefined
  return typeof text === 'string' && text.length > 0 ? text : null
}

const postGeminiContent = async (prompt: string): Promise<string> => {
  const payload = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  }

  const retryDelaysMs = [2000, 4000, 8000]
  let lastError: unknown

  for (const model of modelsToTry()) {
    const request = () => axios.post(buildGeminiGenerateUrl(model), payload)

    for (let attempt = 0; attempt < retryDelaysMs.length; attempt++) {
      try {
        const response = await request()
        const text = extractGeminiText(response.data)
        if (text) {
          return text
        }
        throw new Error('Gemini returned an empty response.')
      } catch (error) {
        lastError = error

        if (!isRetriableGeminiError(error)) {
          break
        }

        const apiMessage = getGeminiApiMessage(error)
        const retryAfterSeconds = parseRetryAfterSeconds(apiMessage)
        const delayMs =
          retryAfterSeconds && retryAfterSeconds > 0 && !hasZeroFreeTierLimit(apiMessage)
            ? retryAfterSeconds * 1000
            : retryDelaysMs[attempt]

        if (attempt < retryDelaysMs.length - 1) {
          await sleep(delayMs)
        }
      }
    }
  }

  if (isAxiosError(lastError) && lastError.response?.status === 429) {
    const apiMessage = getGeminiApiMessage(lastError) || 'Gemini quota exceeded.'
    throw toGeminiQuotaError(429, apiMessage)
  }

  if (isAxiosError(lastError)) {
    const apiMessage = getGeminiApiMessage(lastError)
    if (apiMessage) {
      throw new Error(apiMessage)
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Gemini request failed.')
}

export const isGeminiConfigured = (): boolean => Boolean(API_KEY?.trim())

export const fetchTravelSuggestions = async (prefs: TravelPreferences): Promise<string> => {
  const prompt = `
    You are an Intelligent Travel Assistant. 
    Based on these details, suggest exactly 3 unique, highly contextual activities available today:
    - Current Location: ${prefs.city}
    - Weather Condition: ${prefs.weather}
    - Time of Day: ${prefs.timeOfDay}
    - User Interests: ${prefs.interests.join(', ')}

    Format your response beautifully using clean Markdown. For each activity, include:
    1. A catchy title prefixed with an emoji
    2. A brief description of the activity
    3. A short "Why this fits you today" line referencing their weather or interests.
  `

  return postGeminiContent(prompt)
}

export const sendPlannerGeminiMessage = async (
  userMessage: string,
  explorationId: ExplorationId,
): Promise<GeminiPlannerReply> => {
  if (!isGeminiConfigured()) {
    throw new Error('Gemini is not configured')
  }

  const text = await postGeminiContent(buildPlannerPrompt(userMessage, explorationId))
  const suggestions = parseSuggestions(text)
  return {
    reply: stripJsonBlock(text),
    suggestions,
  }
}
