import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGameProgress } from '../../useGameProgress'

/** Whatever a task keeps between visits, by field: `body`, `name`. */
export type Draft = Record<string, string>

/**
 * Saved state of an exam-task game. These games are not drills: an item counts
 * once it is *finished*, with every point covered, however many hints it took.
 * That is the owner's choice for writing tasks (AGENTS.md section 8).
 */
export interface TaskState {
  done: boolean
  finished: string[]
  drafts: Record<string, Draft>
}

const initialState: TaskState = { done: false, finished: [], drafts: {} }

/** How long typing has to pause before a draft is written to the store (and the cloud). */
const DRAFT_DELAY_MS = 1500

export interface Tasks<T> {
  loaded: boolean
  current: T | null
  index: number
  finished: Set<string>
  total: number
  /** The current task's saved draft (always empty when drafts are off). */
  draft: Draft
  setDraft: (draft: Draft) => void
  select: (id: string) => void
  /** Records the current task as finished. */
  finish: () => void
  /** The next unfinished task after the current one, or null when all are finished. */
  nextUnfinished: T | null
}

/**
 * Drives a task game: which task is open, which are finished, and the drafts.
 * Pass `keepDrafts: false` where the owner types personal details (the form
 * game), so none of it is saved or synced.
 */
export function useTasks<T extends { id: string }>(
  key: string,
  items: T[],
  { keepDrafts = true }: { keepDrafts?: boolean } = {},
): Tasks<T> {
  const { state, loaded, save } = useGameProgress<TaskState>(key, initialState)
  const ids = useMemo(() => new Set(items.map((item) => item.id)), [items])
  const finished = useMemo(
    () => new Set((Array.isArray(state.finished) ? state.finished : []).filter((id) => ids.has(id))),
    [state.finished, ids],
  )
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const latest = useRef({ finished, drafts })
  latest.current = { finished, drafts }
  const timer = useRef<number | null>(null)

  // Open the first unfinished task, and restore the drafts, once the save is in.
  useEffect(() => {
    if (!loaded || currentId !== null) return
    setCurrentId((items.find((item) => !finished.has(item.id)) ?? items[0]).id)
    if (keepDrafts && state.drafts && typeof state.drafts === 'object') setDrafts(state.drafts)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  const write = useCallback(
    (nextFinished: Set<string>, nextDrafts: Record<string, Draft>) => {
      const list = items.filter((item) => nextFinished.has(item.id)).map((item) => item.id)
      save({ done: list.length === items.length, finished: list, drafts: keepDrafts ? nextDrafts : {} })
    },
    [items, keepDrafts, save],
  )

  // Write a pending draft when the game is left mid-sentence.
  useEffect(
    () => () => {
      if (timer.current === null) return
      window.clearTimeout(timer.current)
      write(latest.current.finished, latest.current.drafts)
    },
    [write],
  )

  const setDraft = useCallback(
    (draft: Draft) => {
      if (currentId === null) return
      setDrafts((prev) => ({ ...prev, [currentId]: draft }))
      if (!keepDrafts) return
      if (timer.current !== null) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        timer.current = null
        write(latest.current.finished, latest.current.drafts)
      }, DRAFT_DELAY_MS)
    },
    [currentId, keepDrafts, write],
  )

  const finish = useCallback(() => {
    if (currentId === null) return
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = null
    write(new Set([...finished, currentId]), drafts)
  }, [currentId, drafts, finished, write])

  const index = items.findIndex((item) => item.id === currentId)
  const after = [...items.slice(index + 1), ...items.slice(0, Math.max(index, 0))]

  return {
    loaded: loaded && currentId !== null,
    current: index >= 0 ? items[index] : null,
    index,
    finished,
    total: items.length,
    draft: (currentId !== null && drafts[currentId]) || {},
    setDraft,
    select: setCurrentId,
    finish,
    nextUnfinished: after.find((item) => !finished.has(item.id) && item.id !== currentId) ?? null,
  }
}
