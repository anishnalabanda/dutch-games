import { useCallback, useEffect, useRef, useState } from 'react'
import { useGameProgress } from './useGameProgress'
import { shuffle } from './normalize'

export interface DrillItem {
  id: string
}

/**
 * Shared state for every drill game. An item counts as *mastered* only when it
 * is answered correctly on the first attempt of a presentation: getting it
 * wrong, then right on the retry, sends it back into the queue instead.
 */
export interface DrillState {
  done: boolean
  mastered: string[]
  streak: number
  bestStreak: number
  attempts: number
  correctFirstTry: number
}

export const initialDrillState: DrillState = {
  done: false,
  mastered: [],
  streak: 0,
  bestStreak: 0,
  attempts: 0,
  correctFirstTry: 0,
}

/**
 * Sends a missed item to the back of the queue, so everything else still
 * unmastered comes first. It used to move back only three places, which read as
 * the same sentence over and over. It has to return at some point: an item is
 * only mastered by a first-time-right answer.
 */
function requeue(queue: string[]): string[] {
  if (queue.length <= 1) return queue
  const [head, ...rest] = queue
  return [...rest, head]
}

export interface Drill<T> {
  loaded: boolean
  state: DrillState
  /** The item being asked, or null once every item is mastered. */
  current: T | null
  /** True once this presentation has been answered wrong: it can no longer be mastered. */
  missed: boolean
  mastered: number
  total: number
  /** Increments on every advance, so a game can reset its UI even when the same item repeats. */
  round: number
  /** Record a wrong answer. Breaks the streak and blocks mastery for this presentation. */
  miss: () => void
  /** Record a correct answer. Masters the item only if it was never missed. */
  hit: () => void
  /** Move to the next item: mastered ones leave the queue, missed ones go back into it. */
  advance: () => void
  restart: () => void
}

/**
 * Drives a game's item queue and its saved progress. The queue is shuffled on
 * every run, so the order is never memorised, and `done` means every item has
 * been answered correctly first time: not merely answered correctly once.
 */
export function useDrill<T extends DrillItem>(key: string, items: T[]): Drill<T> {
  const { state, loaded, save } = useGameProgress<DrillState>(key, initialDrillState)
  const [queue, setQueue] = useState<string[]>([])
  const [missed, setMissed] = useState(false)
  const [masteredNow, setMasteredNow] = useState(false)
  const [round, setRound] = useState(0)
  const built = useRef(false)

  // Build the working queue once, from whatever was still unmastered at load.
  useEffect(() => {
    if (!loaded || built.current) return
    built.current = true
    const remaining = items.filter((item) => !state.mastered.includes(item.id))
    setQueue(shuffle(remaining).map((item) => item.id))
  }, [loaded, items, state.mastered])

  const current = queue.length > 0 ? (items.find((item) => item.id === queue[0]) ?? null) : null

  const miss = useCallback(() => {
    setMissed(true)
    save({ ...state, attempts: state.attempts + 1, streak: 0 })
  }, [save, state])

  const hit = useCallback(() => {
    const firstTry = !missed
    setMasteredNow(firstTry)
    if (!firstTry) {
      save({ ...state, attempts: state.attempts + 1 })
      return
    }
    const id = queue[0]
    const mastered = state.mastered.includes(id) ? state.mastered : [...state.mastered, id]
    const streak = state.streak + 1
    save({
      ...state,
      attempts: state.attempts + 1,
      mastered,
      streak,
      bestStreak: Math.max(state.bestStreak, streak),
      correctFirstTry: state.correctFirstTry + 1,
      done: mastered.length === items.length,
    })
  }, [missed, queue, save, state, items.length])

  const advance = useCallback(() => {
    setQueue((q) => (masteredNow ? q.slice(1) : requeue(q)))
    setMissed(false)
    setMasteredNow(false)
    setRound((r) => r + 1)
  }, [masteredNow])

  const restart = useCallback(() => {
    save({ ...initialDrillState, bestStreak: state.bestStreak })
    setQueue(shuffle(items).map((item) => item.id))
    setMissed(false)
    setMasteredNow(false)
    setRound((r) => r + 1)
  }, [items, save, state.bestStreak])

  return {
    loaded,
    state,
    current,
    missed,
    mastered: state.mastered.length,
    total: items.length,
    round,
    miss,
    hit,
    advance,
    restart,
  }
}
