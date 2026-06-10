/** When true (default), fall back to built-in mock planner if the backend is unavailable. */
export const isPlannerMockFallbackEnabled = (): boolean =>
  import.meta.env.VITE_PLANNER_USE_MOCK !== 'false'
