import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { Tag } from '../../../components/Tag'
import { useGameProgress } from '../../useGameProgress'
import { normalize } from '../../normalize'
import { items, SECONDS_PER_ITEM, THEME_LABELS, type VocabItem } from './data'
import './Woordenschat.css'

const STORE_KEY = 'nl.schrijven.woorden'

interface WoordenState {
  done: boolean
  completedIds: string[]
  streak: number
  bestStreak: number
}

const initialState: WoordenState = { done: false, completedIds: [], streak: 0, bestStreak: 0 }

function nextItem(completedIds: string[]): VocabItem | null {
  return items.find((item) => !completedIds.includes(item.id)) ?? null
}

type Verdict = 'goed' | 'lidwoord' | 'fout' | 'tijd'

/** Bare nouns count, but the row says the article out loud: de/het is graded too. */
function judge(item: VocabItem, typed: string): Verdict {
  const answer = normalize(typed)
  if (answer === normalize(item.nl)) return 'goed'
  if (item.bare && answer === normalize(item.bare)) return 'lidwoord'
  return 'fout'
}

export function Woordenschat() {
  const { state, loaded, save } = useGameProgress<WoordenState>(STORE_KEY, initialState)
  const [current, setCurrent] = useState<VocabItem | null>(null)
  const [typed, setTyped] = useState('')
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [left, setLeft] = useState(SECONDS_PER_ITEM)
  const [missed, setMissed] = useState(false)

  useEffect(() => {
    if (!loaded) return
    setCurrent(nextItem(state.completedIds))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  // The row flips when the clock runs out: the answer is shown, nothing is lost.
  useEffect(() => {
    if (!current || verdict !== null) return
    if (left <= 0) {
      setVerdict('tijd')
      setMissed(true)
      return
    }
    const id = window.setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => window.clearTimeout(id)
  }, [left, current, verdict])

  if (!loaded) return null

  function check() {
    if (!current || typed.trim() === '' || verdict !== null) return
    const result = judge(current, typed)
    setVerdict(result)
    if (result === 'fout') {
      setMissed(true)
      save({ ...state, streak: 0 })
      return
    }
    const firstTry = !missed && result === 'goed'
    const completedIds = state.completedIds.includes(current.id)
      ? state.completedIds
      : [...state.completedIds, current.id]
    const streak = firstTry ? state.streak + 1 : 0
    save({
      ...state,
      completedIds,
      streak,
      bestStreak: Math.max(state.bestStreak, streak),
      done: completedIds.length === items.length,
    })
  }

  function retry() {
    setVerdict(null)
    setTyped('')
    setLeft(SECONDS_PER_ITEM)
  }

  function advance() {
    setCurrent(nextItem(state.completedIds))
    setTyped('')
    setVerdict(null)
    setLeft(SECONDS_PER_ITEM)
    setMissed(false)
  }

  function restart() {
    save({ ...initialState, bestStreak: state.bestStreak })
    setCurrent(items[0])
    setTyped('')
    setVerdict(null)
    setLeft(SECONDS_PER_ITEM)
    setMissed(false)
  }

  if (!current) {
    return (
      <Shell title="Woordenschat per thema" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Klaar! Je hebt alle ${items.length} woorden actief opgeschreven. Beste streak: ${state.bestStreak}.`}
          />
          <Button onClick={restart}>Opnieuw oefenen</Button>
        </div>
      </Shell>
    )
  }

  const pct = Math.max(0, Math.round((left / SECONDS_PER_ITEM) * 100))
  const solved = verdict === 'goed' || verdict === 'lidwoord'

  return (
    <Shell
      title="Woordenschat per thema"
      backTo="/schrijven"
      progress={{ value: state.completedIds.length, max: items.length }}
    >
      <div className="g-row">
        <Tag>{THEME_LABELS[current.theme]}</Tag>
        <StreakBadge label="Streak" value={state.streak} />
      </div>

      {/* Departure board row: the English rolls in, the Dutch has to be typed. */}
      <div className={`ws-row ${verdict ? 'ws-row-flipped' : ''}`}>
        <span className="ws-row-label">Engels</span>
        <span className="ws-row-en">{current.en}</span>
        <span className="ws-row-label">Nederlands</span>
        {verdict ? (
          <span className={`ws-row-nl ${solved ? 'ws-row-nl-ok' : 'ws-row-nl-alert'}`}>
            {current.nl}
          </span>
        ) : (
          <input
            className="g-input ws-input"
            value={typed}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            aria-label="Typ het Nederlandse woord"
            placeholder="typ het Nederlandse woord"
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') check()
            }}
          />
        )}
      </div>

      <div className="ws-clock" aria-hidden="true">
        <div className="ws-clock-bar" style={{ width: `${verdict ? 0 : pct}%` }} />
      </div>
      <p className="g-hint">{verdict ? 'Rij geflipt.' : `Nog ${left} seconden.`}</p>

      {verdict && (
        <FeedbackBox
          correct={verdict === 'goed'}
          message={
            verdict === 'goed'
              ? 'Goed geschreven, met het juiste lidwoord.'
              : verdict === 'lidwoord'
                ? `Het woord klopt. Schrijf het lidwoord er wel bij: "${current.nl}", de/het telt mee in het examen.`
                : verdict === 'tijd'
                  ? `De tijd was op. Het woord is "${current.nl}".`
                  : `Nog niet. Het woord is "${current.nl}".`
          }
        />
      )}

      <div className="g-actions">
        {!verdict && (
          <Button onClick={check} disabled={typed.trim() === ''}>
            Controleer
          </Button>
        )}
        {solved && <Button onClick={advance}>Volgende</Button>}
        {(verdict === 'fout' || verdict === 'tijd') && <Button onClick={retry}>Nog een keer</Button>}
      </div>
    </Shell>
  )
}
