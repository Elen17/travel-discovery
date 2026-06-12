import { describe, expect, it } from 'vitest'
import { parseSuggestionsFromText } from './plannerSuggestions'

describe('parseSuggestionsFromText', () => {
  it('parses valid json suggestions from assistant text', () => {
    const text = `
Here are ideas:
\`\`\`json
{
  "suggestions": [
    {
      "id": "waterfall-hike",
      "title": "Waterfall Hike",
      "category": "nature",
      "duration": "5 Hours",
      "description": "Scenic trail",
      "steps": ["Drive to trailhead", "Hike to falls"]
    }
  ]
}
\`\`\`
`

    const result = parseSuggestionsFromText(text)

    expect(result).toEqual([
      {
        id: 'waterfall-hike',
        title: 'Waterfall Hike',
        category: 'nature',
        duration: '5 Hours',
        description: 'Scenic trail',
        steps: ['Drive to trailhead', 'Hike to falls'],
      },
    ])
  })

  it('returns undefined when json block is missing or invalid', () => {
    expect(parseSuggestionsFromText('No suggestions here')).toBeUndefined()
    expect(parseSuggestionsFromText('```json { broken ```')).toBeUndefined()
  })

  it('falls back to safe defaults for partial suggestion data', () => {
    const text = `\`\`\`json
{"suggestions":[{"title":"Spa Day","category":"invalid-category"}]}
\`\`\``

    const result = parseSuggestionsFromText(text)

    expect(result).toEqual([
      {
        id: 'spa-day',
        title: 'Spa Day',
        category: 'nature',
        duration: '4 Hours',
        description: undefined,
        steps: undefined,
      },
    ])
  })
})
