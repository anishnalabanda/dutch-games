import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { Tag } from '../../../components/Tag'
import { useGameProgress } from '../../useGameProgress'
import { items, RULE_EXPLANATIONS, RULE_LABELS, type NegItem, type NegWord } from './data'
import './NietOfGeen.css'

const STORE_KEY = 'nl.schrijven.nietgeen'

interface NietGeenState {
  done: boolean
  completedIds: string[]
  streak: number
  bestStreak: number
  correctFirstTry: number
}

const initialState: NietGeenState = {
  done: false,
  completedIds: [],
  streak: 0,
  bestStreak: 0,
  correctFirstTry: 0,
}

function nextItem(completedIds: string[]): NegItem | null {
  return items.find((item) => !completedIds.includes(item.id)) ?? null
}

/** The full sentence with the negation in place, for the answer key. */
function renderAnswer(item: NegItem): string {
  const words = [...item.tokens]
  words.splice(item.position, 0, item.word)
  return words.join(' ') + item.end
}

export function NietOfGeen() {
  const { state, loaded, save } = useGameProgress<NietGeenState>(STORE_KEY, initialState)
  const [current, setCurrent] = useState<NegItem | null>(null)
  const [word, setWord] = useState<NegWord | null>(null)
  const [placed, setPlaced] = useState<number | null>(null)
  const [missed, setMissed] = useState(false)

  useEffect(() => {
    if (!loaded) return
    setCurrent(nextItem(state.completedIds))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  if (!loaded) return null

  const wordOk = current ? word === current.word : false
  const placeOk = current ? placed === current.position : false
  const correct = wordOk && placeOk

  function place(gap: number) {
    if (!current || word === null || placed !== null) return
    setPlaced(gap)
    if (word !== current.word || gap !== current.position) {
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
    setPlaced(null)
    setWord(null)
  }

  function advance() {
    setCurrent(nextItem(state.completedIds))
    setWord(null)
    setPlaced(null)
    setMissed(false)
  }

  function restart() {
    save({ ...initialState, bestStreak: state.bestStreak })
    setCurrent(items[0])
    setWord(null)
    setPlaced(null)
    setMissed(false)
  }

  if (!current) {
    return (
      <Shell title="Niet of geen" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Klaar! Alle ${items.length} ontkenningen staan op de goede plek. Beste streak: ${state.bestStreak}.`}
          />
          <Button onClick={restart}>Opnieuw oefenen</Button>
        </div>
      </Shell>
    )
  }

  const gaps = current.tokens.length + 1

  return (
    <Shell
      title="Niet of geen"
      backTo="/schrijven"
      progress={{ value: state.completedIds.length, max: items.length }}
    >
      <div className="g-row">
        <Tag>{placed === null ? 'Kies en plaats' : RULE_LABELS[current.rule]}</Tag>
        <StreakBadge label="Streak" value={state.streak} />
      </div>

      <p className="g-hint">
        Maak deze zin ontkennend: <strong className="ng-english">{current.english}</strong>
      </p>

      <div>
        <span className="g-label">1 &middot; Welk woord?</span>
        <div className="g-chips">
          {(['niet', 'geen'] as NegWord[]).map((option) => (
            <button
              key={option}
              className={`g-chip ${word === option ? 'g-chip-selected' : ''}`}
              disabled={placed !== null}
              aria-pressed={word === option}
              onClick={() => setWord(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="g-label">2 &middot; Waar in de zin?</span>
        <div className="g-sentence ng-sentence">
          {Array.from({ length: gaps }).map((_, gap) => (
            <span key={`gap-${gap}`} className="ng-gap-wrap">
              <button
                className={`ng-gap ${placed === gap ? (correct ? 'ng-gap-ok' : 'ng-gap-alert') : ''}`}
                disabled={word === null || placed !== null}
                aria-label={`Plaats ${word ?? 'het woord'} op positie ${gap + 1}`}
                onClick={() => place(gap)}
              >
                {placed === gap ? word : '+'}
              </button>
              {gap < current.tokens.length && (
                <GlossedText className="ng-token" text={current.tokens[gap]} />
              )}
            </span>
          ))}
          <span className="ng-token">{current.end}</span>
        </div>
      </div>

      {placed !== null && (
        <>
          <FeedbackBox
            correct={correct}
            message={
              correct
                ? RULE_EXPLANATIONS[current.rule]
                : !wordOk
                  ? `Hier hoort "${current.word}". ${RULE_EXPLANATIONS[current.rule]}`
                  : `Het woord klopt, de plek nog niet. ${RULE_EXPLANATIONS[current.rule]}`
            }
          />
          {!correct && (
            <p className="g-answer-key">
              Juiste zin: <strong>{renderAnswer(current)}</strong>
            </p>
          )}
        </>
      )}

      <div className="g-actions">
        {placed !== null && correct && <Button onClick={advance}>Volgende</Button>}
        {placed !== null && !correct && <Button onClick={retry}>Probeer opnieuw</Button>}
      </div>
    </Shell>
  )
}
