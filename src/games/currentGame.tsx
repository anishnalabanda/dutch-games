import { createContext, useContext, type ReactNode } from 'react'
import type { GameMeta } from './types'

const CurrentGame = createContext<GameMeta | null>(null)

/**
 * The manifest entry for the game currently on screen. `GamePage` publishes it
 * here so the game `Shell` can show the English subtitle without all fourteen
 * games repeating their own metadata, and without `Shell` importing the
 * manifest (which imports every game component, so that would be a cycle).
 */
export function CurrentGameProvider({ meta, children }: { meta: GameMeta; children: ReactNode }) {
  return <CurrentGame.Provider value={meta}>{children}</CurrentGame.Provider>
}

export function useCurrentGame(): GameMeta | null {
  return useContext(CurrentGame)
}
