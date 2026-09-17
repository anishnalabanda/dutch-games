import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { ProgressStore } from './ProgressStore'
import { LocalStore } from './LocalStore'
import { SupabaseStore } from './SupabaseStore'
import { SyncedStore } from './SyncedStore'
import { getSession, onAuthStateChange, supabase } from '../auth/auth'
import { CLOUD_SYNC_ENABLED } from '../config'

interface StoreContextValue {
  store: ProgressStore
  session: Session | null
  loading: boolean
  cloudSync: boolean
}

const localStore = new LocalStore()
const StoreContext = createContext<StoreContextValue | null>(null)

/**
 * Wipes the local copy. Sign-in is required, so the only progress on this
 * machine belongs to the account signing out; leaving it behind would let the
 * next account read it, and worse, upload it as their own on the next merge.
 */
export async function clearLocalProgress() {
  await localStore.clear()
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [store, setStore] = useState<ProgressStore>(localStore)

  useEffect(() => {
    let cancelled = false
    getSession().then((s) => {
      if (!cancelled) {
        setSession(s)
        setLoading(false)
      }
    })
    const unsubscribe = onAuthStateChange((s) => setSession(s))
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    // No session, or cloud sync disabled (local dev): local storage only, so
    // nothing that happens here is written to the database.
    if (!session || !CLOUD_SYNC_ENABLED) {
      setStore(localStore)
      return
    }
    const cloud = new SupabaseStore(supabase, session.user.id)
    const synced = new SyncedStore(localStore, cloud)
    setStore(synced)
    void synced.mergeFromCloud()
    return () => synced.dispose()
    // Re-run only when the signed-in user actually changes, not on every
    // token refresh (which produces a new session object with the same id).
  }, [session?.user.id])

  return (
    <StoreContext.Provider value={{ store, session, loading, cloudSync: CLOUD_SYNC_ENABLED }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useProgressStore(): ProgressStore {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useProgressStore must be used within StoreProvider')
  return ctx.store
}

export function useAuthSession() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useAuthSession must be used within StoreProvider')
  return { session: ctx.session, loading: ctx.loading, cloudSync: ctx.cloudSync }
}
