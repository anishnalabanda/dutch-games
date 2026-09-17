import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { Tag } from '../../../components/Tag'
import { useGameProgress } from '../../useGameProgress'
import {
  CONNECTOR_MEANINGS,
  items,
  ORDER_RULES,
  SUBORDINATING,
  type ConnItem,
  type Connector,
} from './data'
import './Verbindingswoorden.css'

const STORE_KEY = 'nl.schrijven.voegwoorden'

interface VoegwoordenState {
  done: boolean
  completedIds: string[]
  streak: number
  bestStreak: number
  correctFirstTry: number
}

const initialState: VoegwoordenState = {
  done: false,
  completedIds: [],
  streak: 0,
  bestStreak: 0,
  correctFirstTry: 0,
}

function nextItem(completedIds: string[]): ConnItem | null {
  return items.find((item) => !completedIds.includes(item.id)) ?? null
}

/** Clause 2 with the finite verb moved to the end. */
function verbToEnd(item: ConnItem): string[] {
  const words = [...item.clause2]
  const [verb] = words.splice(item.verbIndex, 1)
  words.push(verb)
  return words
}

export function Verbindingswoorden() {
  const { state, loaded, save } = useGameProgress<VoegwoordenState>(STORE_KEY, initialState)
  const [current, setCurrent] = useState<ConnItem | null>(null)
  const [pick, setPick] = useState<Connector | null>(null)
  const [order, setOrder] = useState<'same' | 'end' | null>(null)
  const [missed, setMissed] = useState(false)

  useEffect(() => {
    if (!loaded) return
    setCurrent(nextItem(state.completedIds))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  if (!loaded) return null

  const connectorOk = current ? pick === current.connector : false
  const needsMove = current ? SUBORDINATING.includes(current.connector) : false
  const orderOk = order !== null && ((needsMove && order === 'end') || (!needsMove && order === 'same'))
  const correct = connectorOk && orderOk

  function choose(option: Connector) {
    if (order !== null) return
    setPick(option)
  }

  function decideOrder(choice: 'same' | 'end') {
    if (!current || pick === null || order !== null) return
    setOrder(choice)
    const rightConnector = pick === current.connector
    const rightOrder = SUBORDINATING.includes(current.connector) ? choice === 'end' : choice === 'same'
    if (!rightConnector || !rightOrder) {
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
    setOrder(null)
    setPick(null)
  }

  function advance() {
    setCurrent(nextItem(state.completedIds))
    setPick(null)
    setOrder(null)
    setMissed(false)
  }

  function restart() {
    save({ ...initialState, bestStreak: state.bestStreak })
    setCurrent(items[0])
    setPick(null)
    setOrder(null)
    setMissed(false)
  }

  if (!current) {
    return (
      <Shell title="Verbindingswoorden" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Klaar! Alle ${items.length} zinnen zijn goed verbonden. Beste streak: ${state.bestStreak}.`}
          />
          <Button onClick={restart}>Opnieuw oefenen</Button>
        </div>
      </Shell>
    )
  }

  // The strip shows the order the player picked, so the verb move is visible.
  const shownWords = order === 'end' ? verbToEnd(current) : current.clause2
  const movedIndex = order === 'end' ? shownWords.length - 1 : current.verbIndex

  let message = ''
  if (order !== null) {
    if (correct) {
      message = `${CONNECTOR_MEANINGS[current.connector]}. ${needsMove ? ORDER_RULES.sub : ORDER_RULES.main}`
    } else if (!connectorOk) {
      message = `Hier past "${current.connector}": ${CONNECTOR_MEANINGS[current.connector]}.`
    } else {
      message = needsMove ? ORDER_RULES.sub : ORDER_RULES.main
    }
  }

  return (
    <Shell
      title="Verbindingswoorden"
      backTo="/schrijven"
      progress={{ value: state.completedIds.length, max: items.length }}
    >
      <div className="g-row">
        <Tag>{pick === null ? 'Kies het voegwoord' : 'Zet de volgorde goed'}</Tag>
        <StreakBadge label="Streak" value={state.streak} />
      </div>

      <p className="g-hint">{current.english}</p>

      <div className="vw-strips">
        <div className="vw-strip">
          <GlossedText text={current.clause1} />
        </div>
        <div className={`vw-connector ${pick ? 'vw-connector-filled' : ''}`}>{pick ?? '···'}</div>
        <div className="vw-strip vw-strip-second">
          {shownWords.map((word, i) => (
            <GlossedText
              key={`${word}-${i}`}
              className={`vw-word ${i === movedIndex ? 'vw-word-verb' : ''}`}
              text={word}
            />
          ))}
          <span className="vw-word">.</span>
        </div>
      </div>

      <div>
        <span className="g-label">1 &middot; Welk voegwoord?</span>
        <div className="g-chips">
          {current.options.map((option) => (
            <button
              key={option}
              className={`g-chip ${pick === option ? 'g-chip-selected' : ''}`}
              disabled={order !== null}
              aria-pressed={pick === option}
              onClick={() => choose(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="g-label">2 &middot; Wat gebeurt er met de persoonsvorm?</span>
        <div className="g-chips">
          <button
            className={`g-chip ${order === 'same' ? 'g-chip-selected' : ''}`}
            disabled={pick === null || order !== null}
            onClick={() => decideOrder('same')}
          >
            Volgorde blijft hetzelfde
          </button>
          <button
            className={`g-chip ${order === 'end' ? 'g-chip-selected' : ''}`}
            disabled={pick === null || order !== null}
            onClick={() => decideOrder('end')}
          >
            Werkwoord naar het eind
          </button>
        </div>
      </div>

      {order !== null && (
        <>
          <FeedbackBox correct={correct} message={message} />
          {!correct && (
            <p className="g-answer-key">
              Juiste zin:{' '}
              <strong>
                {current.clause1} {current.connector}{' '}
                {(SUBORDINATING.includes(current.connector) ? verbToEnd(current) : current.clause2).join(
                  ' ',
                )}
                .
              </strong>
            </p>
          )}
        </>
      )}

      <div className="g-actions">
        {order !== null && correct && <Button onClick={advance}>Volgende</Button>}
        {order !== null && !correct && <Button onClick={retry}>Probeer opnieuw</Button>}
      </div>
    </Shell>
  )
}
