import type { ProgressStore } from './ProgressStore'
import { SYNC_QUEUE_KEY, type LocalStore } from './LocalStore'
import type { SupabaseStore } from './SupabaseStore'

/**
 * ProgressStore for a signed-in user: local is the working copy (reads/writes
 * hit it immediately), cloud is the sync copy (written after, queued and
 * retried on reconnect if the write fails while offline).
 */
export class SyncedStore implements ProgressStore {
  private local: LocalStore
  private cloud: SupabaseStore
  private handleOnline: () => void

  constructor(local: LocalStore, cloud: SupabaseStore) {
    this.local = local
    this.cloud = cloud
    this.handleOnline = () => {
      void this.flushQueue()
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline)
    }
  }

  dispose() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline)
    }
  }

  async get(key: string) {
    return this.local.get(key)
  }

  async all() {
    return this.local.all()
  }

  async set(key: string, value: unknown) {
    await this.local.set(key, value)
    await this.pushToCloud(key, value)
  }

  /** Run once on sign-in: merge local + cloud by updated_at, write the result to both. */
  async mergeFromCloud() {
    const [localEntries, cloudEntries] = await Promise.all([
      this.local.entries(),
      this.cloud.entries(),
    ])
    const keys = new Set([...Object.keys(localEntries), ...Object.keys(cloudEntries)])
    for (const key of keys) {
      const local = localEntries[key]
      const cloud = cloudEntries[key]
      if (local && (!cloud || local.t > cloud.t)) {
        await this.cloud.setWithTimestamp(key, local.v, local.t)
      } else if (cloud && (!local || cloud.t > local.t)) {
        await this.local.setEnvelope(key, cloud)
      }
    }
    await this.flushQueue()
  }

  private async pushToCloud(key: string, value: unknown) {
    try {
      await this.cloud.set(key, value)
    } catch {
      this.queue(key)
    }
  }

  private queue(key: string) {
    try {
      const raw = window.localStorage.getItem(SYNC_QUEUE_KEY)
      const pending: string[] = raw ? JSON.parse(raw) : []
      if (!pending.includes(key)) pending.push(key)
      window.localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(pending))
    } catch {
      // best-effort; if storage is unavailable the pending write is simply lost
    }
  }

  private async flushQueue() {
    let pending: string[] = []
    try {
      const raw = window.localStorage.getItem(SYNC_QUEUE_KEY)
      pending = raw ? JSON.parse(raw) : []
    } catch {
      return
    }
    if (pending.length === 0) return

    const remaining: string[] = []
    for (const key of pending) {
      try {
        const value = await this.local.get(key)
        await this.cloud.set(key, value)
      } catch {
        remaining.push(key)
      }
    }

    try {
      if (remaining.length > 0) {
        window.localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(remaining))
      } else {
        window.localStorage.removeItem(SYNC_QUEUE_KEY)
      }
    } catch {
      // ignore
    }
  }
}
