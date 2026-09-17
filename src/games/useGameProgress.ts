import { useCallback, useEffect, useState } from 'react'
import { useProgressStore } from '../store/StoreProvider'

export interface GameProgress<T> {
  state: T
  loaded: boolean
  /** Writes the next state to React and to the store under this game's key. */
  save: (next: T) => void
}

/**
 * Loads a game's saved state once, then persists every update under its own
 * `nl.<exam>.<game>` key. Games compute the next state themselves and hand it
 * over whole, so the store write stays outside React's state updater.
 */
export function useGameProgress<T extends { done: boolean }>(
  key: string,
  initial: T,
): GameProgress<T> {
  const store = useProgressStore()
  const [state, setState] = useState<T>(initial)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    void store.get(key).then((saved) => {
      if (cancelled) return
      setState({ ...initial, ...(saved as Partial<T> | null) })
      setLoaded(true)
    })
    return () => {
      cancelled = true
    }
    // `initial` is a per-render literal in most games; the key + store identify
    // the load, so re-running on a new object reference would reload forever.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, key])

  const save = useCallback(
    (next: T) => {
      setState(next)
      void store.set(key, next)
    },
    [store, key],
  )

  return { state, loaded, save }
}
