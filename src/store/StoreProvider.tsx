import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ProgressStore } from './ProgressStore'
import { LocalStore } from './LocalStore'
import { SupabaseStore } from './SupabaseStore'
import { SyncedStore } from './SyncedStore'
import { supabase } from './supabaseClient'
import { clearEmail, getEmail, normaliseEmail, setEmail } from '../auth/identity'
import { CLOUD_SYNC_ENABLED } from '../config'

interface StoreContextValue {
  store: ProgressStore
  email: string | null
  cloudSync: boolean
  signIn: (email: string) => void
  signOut: () => Promise<void>
}

const localStore = new LocalStore()
const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [email, setEmailState] = useState<string | null>(() => getEmail())

  const store = useMemo<ProgressStore>(() => {
    // No address, or local dev: localStorage only, so nothing reaches the
    // database. The sign-in screen is what normally keeps the first case away.
    if (!email || !CLOUD_SYNC_ENABLED) return localStore
    const synced = new SyncedStore(localStore, new SupabaseStore(supabase, email))
    void synced.mergeFromCloud()
    return synced
  }, [email])

  const value = useMemo<StoreContextValue>(
    () => ({
      store,
      email,
      cloudSync: CLOUD_SYNC_ENABLED,
      signIn: (next: string) => {
        setEmail(next)
        setEmailState(normaliseEmail(next))
      },
      signOut: async () => {
        // Wipe the local copy first: the next address to use this browser must
        // not inherit it, nor upload it as their own on the next merge.
        await localStore.clear()
        clearEmail()
        setEmailState(null)
      },
    }),
    [store, email],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

function useStoreContext() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStoreContext must be used within StoreProvider')
  return ctx
}

export function useProgressStore(): ProgressStore {
  return useStoreContext().store
}

export function useIdentity() {
  const { email, cloudSync, signIn, signOut } = useStoreContext()
  return { email, cloudSync, signIn, signOut }
}
