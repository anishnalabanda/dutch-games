import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { Tag } from '../../../components/Tag'
import { useGameProgress } from '../../useGameProgress'
import { matchesAnswer } from '../../normalize'
import { items, TYPE_RULES, type QuestionItem } from './data'
import './VragenStellen.css'

const STORE_KEY = 'nl.schrijven.vragen'

interface VragenState {
  done: boolean
  completedIds: string[]
  streak: number
  bestStreak: number
  correctFirstTry: number
}

const initialState: VragenState = {
  done: false,
  completedIds: [],
  streak: 0,
  bestStreak: 0,
  correctFirstTry: 0,
}

function nextItem(completedIds: string[]): QuestionItem | null {
  return items.find((item) => !completedIds.includes(item.id)) ?? null
}

export function VragenStellen() {
  const { state, loaded, save } = useGameProgress<VragenState>(STORE_KEY, initialState)
  const [current, setCurrent] = useState<QuestionItem | null>(null)
  const [typed, setTyped] = useState('')
  const [checked, setChecked] = useState(false)
  const [missed, setMissed] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    if (!loaded) return
    setCurrent(nextItem(state.completedIds))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  if (!loaded) return null

  const correct = current ? matchesAnswer(typed, current.question, current.accept) : false

  function check() {
    if (!current || typed.trim() === '') return
    setChecked(true)
    if (!matchesAnswer(typed, current.question, current.accept)) {
      setMissed(true)
      save({ ...state, streak: 0 })
      return
    }
    const firstTry = !missed && !showHint
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
  }

  function advance() {
    setCurrent(nextItem(state.completedIds))
    setTyped('')
    setChecked(false)
    setMissed(false)
    setShowHint(false)
  }

  function restart() {
    save({ ...initialState, bestStreak: state.bestStreak })
    setCurrent(items[0])
    setTyped('')
    setChecked(false)
    setMissed(false)
    setShowHint(false)
  }

  if (!current) {
    return (
      <Shell title="Vragen stellen" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Klaar! Alle ${items.length} vragen zijn goed geformuleerd. Beste streak: ${state.bestStreak}.`}
          />
          <Button onClick={restart}>Opnieuw oefenen</Button>
        </div>
      </Shell>
    )
  }

  return (
    <Shell
      title="Vragen stellen"
      backTo="/schrijven"
      progress={{ value: state.completedIds.length, max: items.length }}
    >
      <div className="g-row">
        <Tag>{current.type === 'janee' ? 'Ja/nee-vraag' : 'Vraag met vraagwoord'}</Tag>
        <StreakBadge label="Streak" value={state.streak} />
      </div>

      <p className="g-hint">
        Dit is het antwoord. Schrijf de vraag die hoort bij het{' '}
        <span className="vs-focus-legend">gemarkeerde deel</span>.
      </p>

      <div className="vs-answer">
        <span className="g-label">Antwoord</span>
        <p className="vs-answer-text">
          <GlossedText text={current.before} />
          <GlossedText text={current.focus} className="vs-focus" />
          <GlossedText text={current.after} />
        </p>
      </div>

      <div>
        <label className="g-label" htmlFor="vs-question">
          Jouw vraag
        </label>
        <input
          id="vs-question"
          className="g-input vs-input"
          value={typed}
          disabled={checked}
          autoComplete="off"
          spellCheck={false}
          placeholder="Typ de hele vraag"
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') check()
          }}
        />
      </div>

      {showHint && !checked && <p className="g-hint vs-hint">{current.hint}</p>}

      {checked && (
        <>
          <FeedbackBox
            correct={correct}
            message={correct ? TYPE_RULES[current.type] : `${current.hint} ${TYPE_RULES[current.type]}`}
          />
          {!correct && (
            <p className="g-answer-key">
              Modelvraag: <strong>{current.question}</strong>
              {current.accept.length > 0 && (
                <>
                  <br />
                  Ook goed: {current.accept.join(' / ')}
                </>
              )}
            </p>
          )}
        </>
      )}

      <div className="g-actions">
        {!checked && (
          <>
            <Button onClick={check} disabled={typed.trim() === ''}>
              Controleer
            </Button>
            {!showHint && (
              <Button variant="secondary" onClick={() => setShowHint(true)}>
                Hint
              </Button>
            )}
          </>
        )}
        {checked && correct && <Button onClick={advance}>Volgende</Button>}
        {checked && !correct && <Button onClick={retry}>Probeer opnieuw</Button>}
      </div>
    </Shell>
  )
}
