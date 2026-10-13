import { useSyncExternalStore } from 'react'

/**
 * The owner's own Anthropic API key, typed into the app and kept in this
 * browser only. It is never synced: the key avoids the `nl.` prefix, which
 * LocalStore treats as progress and uploads to the open `progress` table
 * (the same reason `__nl_email__` avoids it).
 *
 * "Remember on this device" keeps it in localStorage; otherwise it lives in
 * sessionStorage and is gone when the tab closes.
 */
const KEY = '__claude_key__'

const listeners = new Set<() => void>()

function read(storage: () => Storage): string | null {
  try {
    return storage().getItem(KEY)
  } catch {
    return null
  }
}

/** Held in memory too, so a browser with storage blocked still works for the session. */
let memory: string | null = read(() => window.localStorage) ?? read(() => window.sessionStorage)

function notify() {
  for (const listener of listeners) listener()
}

export function getClaudeKey(): string | null {
  return memory
}

export function setClaudeKey(key: string, remember: boolean) {
  memory = key.trim()
  try {
    ;(remember ? window.localStorage : window.sessionStorage).setItem(KEY, memory)
    ;(remember ? window.sessionStorage : window.localStorage).removeItem(KEY)
  } catch {
    // Storage blocked: the key lasts as long as the page does.
  }
  notify()
}

export function clearClaudeKey() {
  memory = null
  try {
    window.localStorage.removeItem(KEY)
    window.sessionStorage.removeItem(KEY)
  } catch {
    // nothing to clean up
  }
  notify()
}

export function isRemembered(): boolean {
  return read(() => window.localStorage) !== null
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** The key, re-rendering when it is added or removed anywhere in the app. */
export function useClaudeKey(): string | null {
  return useSyncExternalStore(subscribe, getClaudeKey, () => null)
}
