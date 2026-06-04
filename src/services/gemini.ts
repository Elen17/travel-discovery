import axios from 'axios'

export interface TravelPreferences {
  city: string
  weather: string
  timeOfDay: string
  interests: string[]
}

export interface TravelSuggestion {
  title: string
  description: string
  whyItFits: string
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_BASE_URL = import.meta.env.VITE_GEMINI_API_URL
const GEMINI_URL = `${GEMINI_BASE_URL}?key=${API_KEY}`

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
  return response.data.candidates[0].content.parts[0].text
}
