// Placeholder for future OpenAI API integration
// Vite uses import.meta.env to access env vars prefixed with VITE_
// Create .env.local with: VITE_OPENAI_API_KEY=your_key_here

export function getOpenAIKey(): string | undefined {
  return import.meta.env.VITE_OPENAI_API_KEY as string | undefined
}

export type OpenAIModel = 'gpt-4o' | 'gpt-4.1' | 'o4-mini'

export function getDefaultModel(): OpenAIModel {
  return 'gpt-4o'
}

// No API calls yet — Phase 1 is UI only.
