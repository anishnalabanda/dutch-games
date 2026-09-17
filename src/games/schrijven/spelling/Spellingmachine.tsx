import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { Tag } from '../../../components/Tag'
import { useGameProgress } from '../../useGameProgress'
import { normalize } from '../../normalize'
import { items, MODE_LABELS, RULE_EXPLANATIONS, RULE_LABELS, type SpellItem } from './data'
import './Spellingmachine.css'

const STORE_KEY = 'nl.schrijven.spelling'

interface SpellingState {
  done: boolean
  completedIds: string[]
  streak: number
  bestStreak: number
  correctFirstTry: number
}

const initialState: SpellingState = {
  done: false,
  completedIds: [],
  streak: 0,
  bestStreak: 0,
  correctFirstTry: 0,
}

function nextItem(completedIds: string[]): SpellItem | null {
  return items.find((item) => !completedIds.includes(item.id)) ?? null
}

export function Spellingmachine() {
  const { state, loaded, save } = useGameProgress<SpellingState>(STORE_KEY, initialState)
  const [current, setCurrent] = useState<SpellItem | null>(null)
  const [typed, setTyped] = useState('')
  const [checked, setChecked] = useState(false)
  const [missed, setMissed] = useState(false)

  useEffect(() => {
    if (!loaded) return
    setCurrent(nextItem(state.completedIds))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  if (!loaded) return null

  const correct = current ? normalize(typed) === normalize(current.to) : false

  function check() {
    if (!current || typed.trim() === '') return
    setChecked(true)
    if (normalize(typed) !== normalize(current.to)) {
      setMissed(true)
      save({ ...state, streak: 0 })
      return
    }
    const firstTry = !missed
    const completedIds = state.completedIds.includes(current.id)
      ? state.completedIds
      : [...state.completedIds, current.id]
    const streak = firstTry ? state.streak + 1 : 0
    save({
      ...state,
      completedIds,
      streak,
      bestStreak: Math.max(state.bestStreak, streak),
      correctFirstTry: firstTry ? state.correctFirstTry + 1 : state.correctFirstTry,
      done: completedIds.length === items.length,
    })
  }

  function retry() {
    setChecked(false)
    setTyped('')
  }

  function advance() {
    setCurrent(nextItem(state.completedIds))
    setTyped('')
    setChecked(false)
    setMissed(false)
  }

  function restart() {
    save({ ...initialState, bestStreak: state.bestStreak })
    setCurrent(items[0])
    setTyped('')
    setChecked(false)
    setMissed(false)
  }

  if (!current) {
    return (
      <Shell title="Spellingmachine" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Klaar! Alle ${items.length} woorden zijn goed gespeld. Beste streak: ${state.bestStreak}.`}
          />
          <Button onClick={restart}>Opnieuw oefenen</Button>
        </div>
      </Shell>
    )
  }

  return (
    <Shell
      title="Spellingmachine"
      backTo="/schrijven"
      progress={{ value: state.completedIds.length, max: items.length }}
    >
      <div className="g-row">
        <Tag>{RULE_LABELS[current.rule]}</Tag>
        <StreakBadge label="Streak" value={state.streak} />
      </div>

      <p className="g-label">{MODE_LABELS[current.mode]}</p>

      {/* The machine: word in on the left, stretched form out on the right. */}
      <div className="sm-machine">
        <div className="sm-in">
          <span className="sm-word">{current.from}</span>
          <span className="sm-gloss">{current.gloss}</span>
        </div>
        <div className={`sm-belt ${checked && correct ? 'sm-belt-run' : ''}`} aria-hidden="true">
          <span className="sm-belt-arrow">&rarr;</span>
        </div>
        <div className="sm-out">
          {checked && correct ? (
            <span className="sm-word sm-word-ok">{current.to}</span>
          ) : (
            <input
              className="g-input sm-input"
              value={typed}
              disabled={checked}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Typ de nieuwe vorm"
              placeholder="typ hier"
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') check()
              }}
            />
          )}
        </div>
      </div>

      {current.cue && (
        <p className="g-hint">
          Vorm voor: <strong>{current.cue}</strong>
        </p>
      )}

      {checked && (
        <>
          <FeedbackBox
            correct={correct}
            message={
              correct
                ? RULE_EXPLANATIONS[current.rule]
                : `${RULE_EXPLANATIONS[current.rule]} Het juiste woord is "${current.to}".`
            }
          />
        </>
      )}

      <div className="g-actions">
        {!checked && (
          <Button onClick={check} disabled={typed.trim() === ''}>
            Controleer
          </Button>
        )}
        {checked && correct && <Button onClick={advance}>Volgende</Button>}
        {checked && !correct && <Button onClick={retry}>Probeer opnieuw</Button>}
      </div>
    </Shell>
  )
}
