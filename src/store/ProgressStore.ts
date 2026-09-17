export interface ProgressStore {
  get(key: string): Promise<unknown | null>
  set(key: string, value: unknown): Promise<void>
  all(): Promise<Record<string, unknown>>
}
