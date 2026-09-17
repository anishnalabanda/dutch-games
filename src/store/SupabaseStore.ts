import type { SupabaseClient } from '@supabase/supabase-js'
import type { ProgressStore } from './ProgressStore'
import type { Envelope } from './LocalStore'

interface ProgressRow {
  key: string
  value: unknown
  updated_at: string
}

/** ProgressStore backed by the Supabase `progress` table for one signed-in user. */
export class SupabaseStore implements ProgressStore {
  private client: SupabaseClient
  private userId: string

  constructor(client: SupabaseClient, userId: string) {
    this.client = client
    this.userId = userId
  }

  async get(key: string) {
    const { data, error } = await this.client
      .from('progress')
      .select('value')
      .eq('user_id', this.userId)
      .eq('key', key)
      .maybeSingle()
    if (error) throw error
    return data?.value ?? null
  }

  async set(key: string, value: unknown) {
    await this.setWithTimestamp(key, value, new Date().toISOString())
  }

  async all() {
    const rows = await this.fetchRows()
    const result: Record<string, unknown> = {}
    for (const row of rows) result[row.key] = row.value
    return result
  }

  /** Sync-layer only: raw value + timestamp pairs, used for last-write-wins merges. */
  async entries(): Promise<Record<string, Envelope>> {
    const rows = await this.fetchRows()
    const result: Record<string, Envelope> = {}
    for (const row of rows) result[row.key] = { v: row.value, t: row.updated_at }
    return result
  }

  /** Sync-layer only: writes a value with an explicit timestamp, to preserve merge order. */
  async setWithTimestamp(key: string, value: unknown, updatedAt: string) {
    const { error } = await this.client
      .from('progress')
      .upsert({ user_id: this.userId, key, value, updated_at: updatedAt })
    if (error) throw error
  }

  private async fetchRows(): Promise<ProgressRow[]> {
    const { data, error } = await this.client
      .from('progress')
      .select('key, value, updated_at')
      .eq('user_id', this.userId)
    if (error) throw error
    return data ?? []
  }
}
