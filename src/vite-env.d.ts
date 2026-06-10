/// <reference types="vite/client" />

type ImportMetaEnv = {
  readonly VITE_API_BASE_URL: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_GEMINI_API_URL: string
  readonly VITE_GEMINI_MODEL: string
  readonly VITE_PLANNER_USE_MOCK: string
}

type ImportMeta = {
  readonly env: ImportMetaEnv
}
