import { useCallback, useEffect, useRef, useState } from 'react'
import type { Issue } from '../games/schrijven/taken/types'
import { ClaudeError } from './claude'
import { claudeHint, claudeReview, textKey, type Review, type WritingContext } from './feedback'
import { useClaudeKey } from './key'

export interface ClaudeFeedback {
  /** A key is set, so Hint and Submit ask Claude. */
  enabled: boolean
  busy: 'hint' | 'review' | null
  /** English: why the last request failed. The pattern checks carry on regardless. */
  error: string | null
  /** The last review, and whether the text has changed since. */
  review: { review: Review; stale: boolean } | null
  /**
   * Claude's next step; null when there is no key, nothing is written yet or
   * the request failed (use the pattern hint); `ABANDONED` when another task
   * was opened while it ran (do nothing).
   */
  hint: (context: WritingContext, findings: string[]) => Promise<Issue | null | typeof ABANDONED>
  /** Claude's marking, on the same terms. */
  check: (context: WritingContext, findings: string[]) => Promise<Review | null | typeof ABANDONED>
}

export const ABANDONED = Symbol('abandoned')

const hasText = (context: WritingContext) => context.parts.some((p) => p.text.trim() !== '')

/**
 * Claude's side of an exam-task game. Pressing Hint again on unchanged text
 * reuses the answer (the hint ladder goes one level deeper instead), and so
 * does Submit, so a resubmit after adding a name costs nothing. Everything
 * resets when `taskId` changes, and an answer for a task already left is dropped.
 */
export function useClaudeFeedback(taskId: string | undefined, context: WritingContext | null): ClaudeFeedback {
  const key = useClaudeKey()
  const [busy, setBusy] = useState<'hint' | 'review' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [review, setReview] = useState<{ text: string; review: Review } | null>(null)
  const lastHint = useRef<{ text: string; issue: Issue } | null>(null)
  const generation = useRef(0)

  useEffect(() => {
    generation.current += 1
    lastHint.current = null
    setReview(null)
    setError(null)
    setBusy(null)
  }, [taskId])

  const run = useCallback(
    async <T,>(kind: 'hint' | 'review', ask: () => Promise<T>): Promise<T | null | typeof ABANDONED> => {
      const started = generation.current
      setBusy(kind)
      setError(null)
      try {
        const result = await ask()
        return generation.current === started ? result : ABANDONED
      } catch (e) {
        if (generation.current !== started) return ABANDONED
        setError(e instanceof ClaudeError ? e.message : 'Something went wrong talking to Claude.')
        return null
      } finally {
        if (generation.current === started) setBusy(null)
      }
    },
    [],
  )

  const hint = useCallback(
    async (ctx: WritingContext, findings: string[]) => {
      if (!key || !hasText(ctx)) return null
      const text = textKey(ctx)
      if (lastHint.current?.text === text) return lastHint.current.issue
      const issue = await run('hint', () => claudeHint(key, ctx, findings))
      if (issue && issue !== ABANDONED) lastHint.current = { text, issue }
      return issue
    },
    [key, run],
  )

  const check = useCallback(
    async (ctx: WritingContext, findings: string[]) => {
      if (!key || !hasText(ctx)) return null
      const text = textKey(ctx)
      if (review?.text === text) return review.review
      const result = await run('review', () => claudeReview(key, ctx, findings))
      if (result && result !== ABANDONED) setReview({ text, review: result })
      return result
    },
    [key, review, run],
  )

  return {
    enabled: key !== null,
    busy,
    error,
    review: review && { review: review.review, stale: context !== null && textKey(context) !== review.text },
    hint,
    check,
  }
}
