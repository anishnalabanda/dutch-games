import type { ProgressStore } from './ProgressStore'

const PREFIX = 'nl.'

export interface Envelope {
  v: unknown
  t: string
}

function safeLocalStorage(): Storage | null {
  try {
    const testKey = '__nl_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return window.localStorage
  } catch {
    return null
  }
}

/** Wraps localStorage; degrades to an in-memory Map if storage is unavailable. */
export class LocalStore implements ProgressStore {
  private memory = new Map<string, Envelope>()
  private storage: Storage | null

  constructor() {
    this.storage = safeLocalStorage()
  }

  async get(key: string) {
    return this.read(key)?.v ?? null
  }

  async set(key: string, value: unknown) {
    this.write(key, { v: value, t: new Date().toISOString() })
  }

  async all() {
    const result: Record<string, unknown> = {}
    for (const [key, envelope] of this.entriesList()) {
      result[key] = envelope.v
    }
    return result
  }

  async bulk(data: Record<string, unknown>) {
    for (const [key, value] of Object.entries(data)) {
      await this.set(key, value)
    }
  }

  /** Sync-layer only: raw value + timestamp pairs, used for last-write-wins merges. */
  async entries(): Promise<Record<string, Envelope>> {
    const result: Record<string, Envelope> = {}
    for (const [key, envelope] of this.entriesList()) {
      result[key] = envelope
    }
    return result
  }

  /** Sync-layer only: writes a raw envelope, preserving a cloud-origin timestamp. */
  async setEnvelope(key: string, envelope: Envelope) {
    this.write(key, envelope)
  }

  private read(key: string): Envelope | null {
    if (this.storage) {
      try {
        const raw = this.storage.getItem(key)
        return raw ? (JSON.parse(raw) as Envelope) : null
      } catch {
        return null
      }
    }
    return this.memory.get(key) ?? null
  }

  private write(key: string, envelope: Envelope) {
    if (this.storage) {
      try {
        this.storage.setItem(key, JSON.stringify(envelope))
        return
      } catch {
        // storage full or unavailable mid-session; fall back to memory below
      }
    }
    this.memory.set(key, envelope)
  }

  private entriesList(): Array<[string, Envelope]> {
    const result: Array<[string, Envelope]> = []
    if (this.storage) {
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i)
        if (!key || !key.startsWith(PREFIX)) continue
        const envelope = this.read(key)
        if (envelope) result.push([key, envelope])
      }
    } else {
      for (const [key, envelope] of this.memory) {
        if (key.startsWith(PREFIX)) result.push([key, envelope])
      }
    }
    return result
  }
}
