import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClaudePanel } from '../ai/ClaudePanel'
import { claudeCoaching, type Coaching, type GameMistakes } from '../ai/coach'
import { ClaudeError } from '../ai/claude'
import { useClaudeKey } from '../ai/key'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { GlossedText } from '../components/GlossedText'
import { forms } from '../games/schrijven/formulieren/data'
import { tasks as wijkkrant } from '../games/schrijven/wijkkrant/data'
import { tasks as informeel } from '../games/schrijven/informeel/data'
import { tasks as formeel } from '../games/schrijven/formeel/data'
import { MISTAKE_LABEL, type Mistake, type MistakeLog, type MistakeType } from '../games/schrijven/taken/mistakes'
import { FEEDBACK_FROM } from '../games/schrijven/taken/parts'
import { useProgressStore } from '../store/StoreProvider'
import '../ai/ai.css'
import './WritingFeedback.css'

/** The saved coaching, and what it was based on, so it is only asked for again when there is more to go on. */
const STORE_KEY = 'nl.schrijven.feedback'

interface SavedCoaching {
  done: boolean
  basis: string
  coaching: Coaching
}

const GAMES = [
  { key: 'nl.schrijven.formulieren', name: 'Form', items: forms },
  { key: 'nl.schrijven.wijkkrant', name: 'Neighbourhood paper', items: wijkkrant },
  { key: 'nl.schrijven.informeel', name: 'Informal message', items: informeel },
  { key: 'nl.schrijven.formeel', name: 'Formal e-mail', items: formeel },
]

/** How many tasks a type came up in, with up to two quoted examples. */
interface Count {
  type: MistakeType
  tasks: number
  examples: Mistake[]
}

/**
 * Feedback across the four exam-task games: the kinds of mistake that keep
 * coming back, counted from each finished task's latest attempt, and with a
 * key, Claude's reading of them with a short exercise per habit.
 */
export function WritingFeedback() {
  const store = useProgressStore()
  const key = useClaudeKey()
  const [saved, setSaved] = useState<Record<string, unknown> | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void store.all().then((data) => {
      if (!cancelled) setSaved(data)
    })
    return () => {
      cancelled = true
    }
  }, [store])

  if (!saved) return null

  const games: GameMistakes[] = GAMES.map((game) => {
    const state = (saved[game.key] ?? {}) as { finished?: unknown; mistakes?: MistakeLog }
    const finished = new Set(Array.isArray(state.finished) ? (state.finished as string[]) : [])
    const log = state.mistakes && typeof state.mistakes === 'object' ? state.mistakes : {}
    return {
      game: game.name,
      tasks: game.items
        .filter((item) => finished.has(item.id))
        .map((item) => ({ title: item.title, mistakes: Array.isArray(log[item.id]) ? log[item.id] : [] })),
    }
  })
  const finishedCount = games.reduce((n, g) => n + g.tasks.length, 0)
  const recorded = games.flatMap((g) => g.tasks).filter((t) => t.mistakes.length > 0)
  const counts = countTypes(games)
  const basis = fingerprint(JSON.stringify(games))
  const coaching = saved[STORE_KEY] as SavedCoaching | undefined
  const fresh = coaching?.basis === basis

  async function ask() {
    if (!key) return
    setBusy(true)
    setError(null)
    try {
      const result = await claudeCoaching(key, games)
      const next: SavedCoaching = { done: false, basis, coaching: result }
      await store.set(STORE_KEY, next)
      setSaved((prev) => ({ ...prev, [STORE_KEY]: next }))
    } catch (e) {
      setError(e instanceof ClaudeError ? e.message : 'Something went wrong talking to Claude.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="exam-page wf">
      <Link to="/schrijven" className="exam-page-back">
        &larr; Schrijven
      </Link>
      <h1>Writing feedback</h1>
      <p className="wf-intro">
        {finishedCount} {finishedCount === 1 ? 'task' : 'tasks'} finished across the four exam tasks. Each one counts
        with the mistakes of your latest attempt, so a task you redo without the mistake stops counting it.
      </p>

      {finishedCount < FEEDBACK_FROM ? (
        <Card>Finish at least {FEEDBACK_FROM} tasks first: before that, a pattern cannot be told apart from a slip.</Card>
      ) : recorded.length === 0 ? (
        <Card>
          No mistakes recorded yet. Mistakes are saved from your submits since this page was added, so tasks finished
          before then count as clean. Do a few tasks (or redo some) and come back.
        </Card>
      ) : (
        <>
          <section className="wf-section">
            <span className="g-label">Mistakes that keep coming back</span>
            {counts.length === 0 ? (
              <p className="ai-small">Nothing came up in two or more tasks: no habits, only one-off slips.</p>
            ) : (
              <ul className="wf-counts">
                {counts.map((c) => (
                  <li key={c.type}>
                    <div className="wf-count-head">
                      <strong>{MISTAKE_LABEL[c.type]}</strong>
                      <span className="wf-count-n">
                        {c.tasks} of {finishedCount} tasks
                      </span>
                    </div>
                    {c.examples.map((m, i) => (
                      <Fix key={i} original={m.original ?? ''} corrected={m.corrected ?? ''} />
                    ))}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="wf-section">
            <span className="g-label">Claude's feedback</span>
            {!key ? (
              <>
                <p className="ai-small">Add your Claude key to get the habits behind these mistakes, with a short exercise for each.</p>
                <ClaudePanel />
              </>
            ) : (
              <>
                {coaching && <CoachingView coaching={coaching.coaching} />}
                {coaching && !fresh && <p className="ai-small">You have finished or redone tasks since this feedback.</p>}
                {busy && (
                  <p className="ai-status" role="status">
                    Claude is reading your mistakes…
                  </p>
                )}
                {error && (
                  <p className="ai-error" role="status">
                    {error}
                  </p>
                )}
                {(!coaching || !fresh) && (
                  <div className="g-actions">
                    <Button onClick={ask} disabled={busy}>
                      {coaching ? 'Get new feedback' : 'Get feedback'}
                    </Button>
                  </div>
                )}
                <p className="ai-small">
                  Claude sees the mistakes saved from each task, not your whole texts. The form game keeps only the kind
                  of each mistake, never your words.
                </p>
              </>
            )}
          </section>
        </>
      )}
    </div>
  )
}

/** A short stand-in for what the feedback was based on, so the saved copy does not repeat every mistake. */
function fingerprint(text: string): string {
  let h = 5381
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0
  return `${text.length}-${(h >>> 0).toString(36)}`
}

/** Mistake types ranked by how many finished tasks they came up in; only those in two or more. */
function countTypes(games: GameMistakes[]): Count[] {
  const byType = new Map<MistakeType, Count>()
  for (const task of games.flatMap((g) => g.tasks)) {
    const seen = new Set<MistakeType>()
    for (const m of task.mistakes) {
      if (!(m.type in MISTAKE_LABEL)) continue
      const count = byType.get(m.type) ?? { type: m.type, tasks: 0, examples: [] }
      if (!seen.has(m.type)) count.tasks += 1
      seen.add(m.type)
      if (m.original && m.corrected && count.examples.length < 2) count.examples.push(m)
      byType.set(m.type, count)
    }
  }
  return [...byType.values()].filter((c) => c.tasks >= 2).sort((a, b) => b.tasks - a.tasks)
}

function Fix({ original, corrected }: { original: string; corrected: string }) {
  return (
    <div className="ai-fix">
      <span className="ai-fix-from">
        <GlossedText text={original} />
      </span>
      <span className="ai-fix-arrow" aria-label="becomes">
        →
      </span>
      <span className="ai-fix-to">
        <GlossedText text={corrected} />
      </span>
    </div>
  )
}

function CoachingView({ coaching }: { coaching: Coaching }) {
  return (
    <div className="wf-coaching">
      <p>{coaching.summary}</p>
      {(coaching.habits ?? []).map((habit, i) => (
        <Card key={i} className="wf-habit">
          <h3>
            {i + 1}. {habit.title}
          </h3>
          {(habit.examples ?? []).map((ex, j) => (
            <Fix key={j} original={ex.original} corrected={ex.corrected} />
          ))}
          <p>{habit.rule}</p>
          <span className="g-label">Practice: rewrite these</span>
          <ol className="wf-practice">
            {(habit.practice ?? []).map((p, j) => (
              <li key={j}>
                <GlossedText text={p.wrong} />
                <details>
                  <summary>Show answer</summary>
                  <GlossedText text={p.right} />
                </details>
              </li>
            ))}
          </ol>
        </Card>
      ))}
      <p className="wf-strength">
        <strong>Already good:</strong> {coaching.strength}
      </p>
    </div>
  )
}
