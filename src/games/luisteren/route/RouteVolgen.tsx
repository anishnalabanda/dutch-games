import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { GlossedText } from '../../../components/GlossedText'
import { StreakBadge } from '../../../components/StreakBadge'
import { useDrill } from '../../useDrill'
import { useDutchSpeech } from '../speech'
import {
  NOT_TURN,
  PARK_PLACE,
  PARK_PLACES,
  PARK_QUESTION,
  PARK_REASON,
  SIDE_WORD,
  TURN_ARROW,
  TURN_WORD,
  TURNS,
  routes,
  type ParkId,
  type Stop,
  type Turn,
} from './data'
import './RouteVolgen.css'

const STORE_KEY = 'nl.luisteren.route'

/** Why the answer is what it is, in English, for a stop answered wrong. */
function explain(stop: Stop): string {
  const right = TURN_WORD[stop.turn]
  if (stop.style === 'niet') {
    return `Both turns are said. "Niet ${TURN_WORD[NOT_TURN[stop.turn]]}" is the trap: the turn is the word after "maar", ${right}.`
  }
  if (stop.style === 'side') {
    return `"Aan je ${SIDE_WORD[stop.turn]}" says where ${stop.landmark} is, not where you turn. The turn comes after "daar": ${right}.`
  }
  return `At ${stop.landmark} the message says ${right}.`
}

/**
 * Hear a voicemail with directions, then answer what to do at each landmark and
 * where to park. A route is mastered only when every question is right first
 * time without reading the text.
 */
export function RouteVolgen() {
  const drill = useDrill(STORE_KEY, routes)
  const speech = useDutchSpeech()
  const [turns, setTurns] = useState<(Turn | null)[]>([])
  const [park, setPark] = useState<ParkId | null>(null)
  const [checked, setChecked] = useState(false)
  const [shown, setShown] = useState(false)
  const current = drill.current
  const currentId = current?.id
  const { speak, stop: stopSpeech } = speech

  useEffect(() => {
    setTurns(current ? current.stops.map(() => null) : [])
    setPark(null)
    setChecked(false)
    setShown(false)
    stopSpeech()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, drill.round])

  if (!drill.loaded) return null

  const shell = (children: React.ReactNode) => (
    <Shell
      title="Route volgen"
      backTo="/luisteren"
      progress={{ value: drill.mastered, max: drill.total }}
      countLabel="routes right first time"
    >
      {children}
    </Shell>
  )

  if (!current) {
    return shell(
      <div className="g-done">
        <FeedbackBox
          correct
          message={`Done. You followed all ${routes.length} routes by ear, every question right first time. Best streak: ${drill.state.bestStreak}.`}
        />
        <div className="g-actions">
          <Button onClick={drill.restart}>Practise again</Button>
        </div>
      </div>,
    )
  }

  const text = current.sentences.join(' ')
  const allAnswered = turns.length === current.stops.length && turns.every((t) => t !== null) && park !== null
  const turnsRight = current.stops.map((s, i) => turns[i] === s.turn)
  const parkRight = park === current.park
  const allRight = turnsRight.every(Boolean) && parkRight

  function play(slow = false) {
    speak(text, { slow })
  }

  function check() {
    if (!allAnswered || checked) return
    setChecked(true)
    stopSpeech()
    if (allRight && !shown) drill.hit()
    else drill.miss()
  }

  function pickTurn(i: number, turn: Turn) {
    if (checked) return
    setTurns((prev) => prev.map((t, j) => (j === i ? turn : t)))
  }

  function radioKeys(e: React.KeyboardEvent, action: () => void) {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    action()
  }

  return shell(
    <>
      <div className="g-row">
        <span className="g-hint">
          {current.caller} explains the way to {current.to}. Read the questions, then listen.
        </span>
        <StreakBadge label="Streak" value={drill.state.streak} />
      </div>

      <div className="rv-board">
        {speech.supported ? (
          <div className="g-actions">
            <Button onClick={() => play()}>&#9654; Play the message</Button>
            <Button variant="secondary" onClick={() => play(true)}>
              Slower
            </Button>
            <Button variant="secondary" onClick={stopSpeech}>
              Stop
            </Button>
          </div>
        ) : (
          <p className="g-hint">This browser cannot speak, so the message is shown as text.</p>
        )}
        {shown || checked || !speech.supported ? (
          <ol className="rv-transcript" lang="nl">
            {current.sentences.map((sentence, i) => {
              const stopIndex = current.stops.findIndex((s) => s.sentence === sentence)
              const isPark = current.parkSentences.includes(sentence)
              const wrong =
                checked && ((stopIndex >= 0 && !turnsRight[stopIndex]) || (isPark && !parkRight))
              return (
                <li key={i} className={wrong ? 'rv-line-wrong' : ''}>
                  <GlossedText text={sentence} />
                </li>
              )
            })}
          </ol>
        ) : (
          <button
            type="button"
            className="rv-reveal"
            onClick={() => {
              stopSpeech()
              setShown(true)
            }}
          >
            Show the text (the route then comes round again)
          </button>
        )}
      </div>

      <ol className="rv-questions">
        {current.stops.map((stop, i) => {
          const picked = turns[i]
          return (
            <li key={stop.landmark} className="rv-question">
              <GlossedText className="rv-question-text" text={stop.question} />
              <div className="rv-turns" role="radiogroup" aria-label={stop.question}>
                {TURNS.map((turn) => {
                  const selected = picked === turn
                  const mark = checked
                    ? turn === stop.turn
                      ? 'g-chip-ok'
                      : selected
                        ? 'g-chip-alert'
                        : ''
                    : ''
                  return (
                    <div
                      key={turn}
                      role="radio"
                      tabIndex={0}
                      aria-checked={selected}
                      aria-disabled={checked}
                      className={`g-chip rv-turn ${selected ? 'g-chip-selected' : ''} ${mark} ${checked ? 'rv-locked' : ''}`}
                      onClick={() => pickTurn(i, turn)}
                      onKeyDown={(e) => radioKeys(e, () => pickTurn(i, turn))}
                    >
                      <span className="rv-arrow" aria-hidden="true">
                        {TURN_ARROW[turn]}
                      </span>
                      <GlossedText text={`Je moet ${TURN_WORD[turn]}.`} />
                    </div>
                  )
                })}
              </div>
              {checked && !turnsRight[i] && <p className="rv-why">{explain(stop)}</p>}
            </li>
          )
        })}

        <li className="rv-question">
          <GlossedText className="rv-question-text" text={PARK_QUESTION} />
          <div className="rv-parks" role="radiogroup" aria-label={PARK_QUESTION}>
            {PARK_PLACES.map((place) => {
              const selected = park === place
              const mark = checked
                ? place === current.park
                  ? 'g-chip-ok'
                  : selected
                    ? 'g-chip-alert'
                    : ''
                : ''
              return (
                <div
                  key={place}
                  role="radio"
                  tabIndex={0}
                  aria-checked={selected}
                  aria-disabled={checked}
                  className={`g-chip rv-turn ${selected ? 'g-chip-selected' : ''} ${mark} ${checked ? 'rv-locked' : ''}`}
                  onClick={() => !checked && setPark(place)}
                  onKeyDown={(e) => radioKeys(e, () => !checked && setPark(place))}
                >
                  <GlossedText text={`${PARK_PLACE[place][0].toUpperCase()}${PARK_PLACE[place].slice(1)}.`} />
                </div>
              )
            })}
          </div>
          {checked && !parkRight && (
            <p className="rv-why">
              {park === current.decoy
                ? `That place was ruled out. The message gives the reason: "${PARK_REASON[current.decoy]}"`
                : `The message only mentions two places: the one to use, and one that is ruled out with a reason.`}
            </p>
          )}
        </li>
      </ol>

      {checked ? (
        <>
          <FeedbackBox
            correct={allRight && !shown}
            message={
              allRight
                ? shown
                  ? 'All right, but you read the text, so this route comes round again to do by ear.'
                  : 'All right first time.'
                : 'Not all right. The lines you missed are marked in the text above. This route comes round again.'
            }
          />
          <div className="g-actions">
            <Button autoFocus onClick={drill.advance}>
              Next route
            </Button>
          </div>
        </>
      ) : (
        <div className="g-actions">
          <Button onClick={check} disabled={!allAnswered}>
            Check
          </Button>
        </div>
      )}

      <p className="g-hint">
        A computer voice reads these routes from patterns. The exam plays a real voicemail at
        normal speed, so do the DUO practice exams on inburgeren.nl as well.
      </p>
    </>,
  )
}
