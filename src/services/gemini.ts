import axios from 'axios'
import type { ExplorationId, PlannerSuggestion } from '@/types/planner'

export type TravelPreferences = {
  city: string
  weather: string
  timeOfDay: string
  interests: string[]
}

export type GeminiPlannerReply = {
  reply: string
  suggestions?: PlannerSuggestion[]
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_BASE_URL = import.meta.env.VITE_GEMINI_API_URL
const GEMINI_URL = `${GEMINI_BASE_URL}?key=${API_KEY}`

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
  const prompt = `Current trip destination: ${explorationId}.\n\n${userMessage}`

  if (!isInsightsRequest(userMessage)) {
    return prompt
  }

  return `${prompt}

Include exactly 3 itinerary suggestions and end with a fenced JSON block:

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

export const isGeminiConfigured = (): boolean =>
  Boolean(API_KEY?.trim()) && Boolean(GEMINI_BASE_URL?.trim())

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

  const payload = {
    contents: [{
      parts: [{ text: prompt }],
    }],
  }

  const response = await axios.post(GEMINI_URL, payload)
  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Gemini returned an empty response')
  }
  return text
}

export const sendPlannerGeminiMessage = async (
  userMessage: string,
  explorationId: ExplorationId,
): Promise<GeminiPlannerReply> => {
  if (!isGeminiConfigured()) {
    throw new Error('Gemini is not configured')
  }

  const payload = {
    contents: [{
      parts: [{ text: buildPlannerPrompt(userMessage, explorationId) }],
    }],
  }

  const response = await axios.post(GEMINI_URL, payload)
  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Gemini returned an empty response')
  }

  const suggestions = parseSuggestions(text)
  return {
    reply: stripJsonBlock(text),
    suggestions,
  }
}
