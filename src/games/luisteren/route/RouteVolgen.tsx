import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { GlossedText } from '../../../components/GlossedText'
import { StreakBadge } from '../../../components/StreakBadge'
import { useDrill, type Drill } from '../../useDrill'
import { useDutchSpeech } from '../speech'
import { VoiceSettings } from '../VoiceSettings'
import { WordPractice } from '../woorden/WoordenLuisteren'
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
  routeWords,
  routes,
  sentences,
  type ParkId,
  type Route,
  type Sentence,
  type Stop,
  type Turn,
} from './data'
import './RouteVolgen.css'

const STORE_KEY = 'nl.luisteren.route'
// The first two steps keep their own saves next to the game's key; the hub counts the routes.
const WORDS_KEY = 'nl.luisteren.route-woorden'
const SENTENCES_KEY = 'nl.luisteren.route-zinnen'

type Speech = ReturnType<typeof useDutchSpeech>
type Step = 'woorden' | 'zinnen' | 'route'

const STEPS: { id: Step; label: string; countLabel: string }[] = [
  { id: 'woorden', label: '1. Words', countLabel: 'words recognised first time' },
  { id: 'zinnen', label: '2. Sentences', countLabel: 'sentences right first time' },
  { id: 'route', label: '3. Whole message', countLabel: 'routes right first time' },
]

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

function explainPark(picked: ParkId, decoy: ParkId): string {
  return picked === decoy
    ? `That place was ruled out. The message gives the reason: "${PARK_REASON[decoy]}"`
    : 'The message only mentions two places: the one to use, and one that is ruled out with a reason.'
}

function turnText(turn: Turn): string {
  return `Je moet ${TURN_WORD[turn]}.`
}

function parkText(place: ParkId): string {
  return `${PARK_PLACE[place][0].toUpperCase()}${PARK_PLACE[place].slice(1)}.`
}

function radioKeys(e: React.KeyboardEvent, action: () => void) {
  if (e.key !== 'Enter' && e.key !== ' ') return
  e.preventDefault()
  action()
}

/**
 * A row of Dutch answer chips. They hold `GlossedText`, so they are radios, not
 * buttons. `answer` is set once the choice is checked: it marks right and wrong.
 */
function Choices<T extends string>({
  options,
  label,
  picked,
  answer,
  onPick,
  text,
  arrow,
  className,
}: {
  options: T[]
  label: string
  picked: T | null
  answer: T | null
  onPick: (option: T) => void
  text: (option: T) => string
  arrow?: (option: T) => string
  className: string
}) {
  const locked = answer !== null
  return (
    <div className={className} role="radiogroup" aria-label={label}>
      {options.map((option) => {
        const selected = picked === option
        const mark = locked ? (option === answer ? 'g-chip-ok' : selected ? 'g-chip-alert' : '') : ''
        const pick = () => !locked && onPick(option)
        return (
          <div
            key={option}
            role="radio"
            tabIndex={0}
            aria-checked={selected}
            aria-disabled={locked}
            className={`g-chip rv-turn ${selected ? 'g-chip-selected' : ''} ${mark} ${locked ? 'rv-locked' : ''}`}
            onClick={pick}
            onKeyDown={(e) => radioKeys(e, pick)}
          >
            {arrow && (
              <span className="rv-arrow" aria-hidden="true">
                {arrow(option)}
              </span>
            )}
            <GlossedText text={text(option)} />
          </div>
        )
      })}
    </div>
  )
}

/**
 * Directions by ear, built up in three steps: the words the messages are made
 * of, then one line at a time, then a whole voicemail with a question per
 * landmark and where to park. Each step is its own drill, so each one counts
 * only first-time-right answers. It opens on the first step not yet done.
 */
export function RouteVolgen() {
  const wordDrill = useDrill(WORDS_KEY, routeWords)
  const sentenceDrill = useDrill(SENTENCES_KEY, sentences)
  const routeDrill = useDrill(STORE_KEY, routes)
  const speech = useDutchSpeech()
  const [step, setStep] = useState<Step | null>(null)
  const loaded = wordDrill.loaded && sentenceDrill.loaded && routeDrill.loaded

  useEffect(() => {
    if (!loaded || step !== null) return
    setStep(!wordDrill.state.done ? 'woorden' : !sentenceDrill.state.done ? 'zinnen' : 'route')
  }, [loaded, step, wordDrill.state.done, sentenceDrill.state.done])

  if (!loaded || step === null) return null

  const drills: Record<Step, Drill<{ id: string }>> = {
    woorden: wordDrill,
    zinnen: sentenceDrill,
    route: routeDrill,
  }
  const active = drills[step]
  const meta = STEPS.find((s) => s.id === step)!

  function go(next: Step) {
    speech.stop()
    setStep(next)
  }

  return (
    <Shell
      title="Route volgen"
      backTo="/luisteren"
      progress={{ value: active.mastered, max: active.total }}
      countLabel={meta.countLabel}
    >
      <div className="g-chips" role="group" aria-label="Step">
        {STEPS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`g-chip ${step === s.id ? 'g-chip-selected' : ''}`}
            aria-pressed={step === s.id}
            onClick={() => go(s.id)}
          >
            {s.label}{' '}
            <span className="rv-step-count">
              {drills[s.id].mastered}/{drills[s.id].total}
            </span>
          </button>
        ))}
      </div>

      <VoiceSettings speech={speech} />

      {step === 'woorden' && (
        <>
          <p className="g-hint">
            First the words every message is built from. Go through the list, then test them by
            ear.
          </p>
          <WordPractice
            items={routeWords}
            drill={wordDrill}
            speech={speech}
            next={{ label: 'Next: sentences', onClick: () => go('zinnen') }}
          />
        </>
      )}
      {step === 'zinnen' && (
        <SentenceStep drill={sentenceDrill} speech={speech} onNext={() => go('route')} />
      )}
      {step === 'route' && <RouteStep drill={routeDrill} speech={speech} />}

      <p className="g-hint">
        A computer voice reads these from patterns. The exam plays a real voicemail at normal
        speed, so do the DUO practice exams on inburgeren.nl as well.
      </p>
    </Shell>
  )
}

/**
 * Step 2: one line is said, and one question answered: which way at its
 * landmark, or for a parking pair, where to park. Reading the line first counts
 * as a miss, as in the word drill.
 */
function SentenceStep({
  drill,
  speech,
  onNext,
}: {
  drill: Drill<Sentence>
  speech: Speech
  onNext: () => void
}) {
  const [picked, setPicked] = useState<string | null>(null)
  const [shown, setShown] = useState(false)
  const current = drill.current
  const currentId = current?.id
  const { speak } = speech

  const text = current ? (current.kind === 'turn' ? current.stop.sentence : current.lines.join(' ')) : ''

  useEffect(() => {
    setPicked(null)
    setShown(false)
    if (text) speak(text)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, drill.round])

  if (!current) {
    return (
      <div className="g-done">
        <FeedbackBox
          correct
          message={`Done. You understood all ${sentences.length} sentences by ear, first time. Best streak: ${drill.state.bestStreak}.`}
        />
        <div className="g-actions">
          <Button onClick={onNext}>Next: whole messages</Button>
          <Button variant="secondary" onClick={drill.restart}>
            Practise again
          </Button>
        </div>
      </div>
    )
  }

  const answer = current.kind === 'turn' ? current.stop.turn : current.park
  const answered = picked !== null
  const right = picked === answer
  const textVisible = answered || shown || !speech.supported

  function pick(option: string) {
    if (answered) return
    setPicked(option)
    if (option === answer) drill.hit()
    else if (!shown) drill.miss()
  }

  function showText() {
    // Reading the line is not hearing it: it comes round again.
    if (!shown && !answered) drill.miss()
    setShown(true)
  }

  const why = answered && !right
    ? current.kind === 'turn'
      ? explain(current.stop)
      : explainPark(picked as ParkId, current.decoy)
    : null

  return (
    <>
      <div className="g-row">
        <span className="g-hint">Listen to one line, then answer.</span>
        <StreakBadge label="Streak" value={drill.state.streak} />
      </div>

      <div className="rv-board">
        {speech.supported && (
          <div className="g-actions">
            <Button onClick={() => speak(text)}>&#9654; Play again</Button>
            <Button variant="secondary" onClick={() => speak(text, { slow: true })}>
              Slower
            </Button>
          </div>
        )}
        {textVisible ? (
          <ol className="rv-transcript" lang="nl">
            {(current.kind === 'turn' ? [current.stop.sentence] : current.lines).map((line) => (
              <li key={line}>
                <GlossedText text={line} />
              </li>
            ))}
          </ol>
        ) : (
          <button type="button" className="rv-reveal" onClick={showText}>
            Show the text (counts as a miss)
          </button>
        )}
      </div>

      <div className="rv-question">
        {current.kind === 'turn' ? (
          <>
            <GlossedText className="rv-question-text" text={current.stop.question} />
            <Choices
              className="rv-turns"
              options={TURNS}
              label={current.stop.question}
              picked={picked as Turn | null}
              answer={answered ? current.stop.turn : null}
              onPick={pick}
              text={turnText}
              arrow={(t) => TURN_ARROW[t]}
            />
          </>
        ) : (
          <>
            <GlossedText className="rv-question-text" text={PARK_QUESTION} />
            <Choices
              className="rv-parks"
              options={PARK_PLACES}
              label={PARK_QUESTION}
              picked={picked as ParkId | null}
              answer={answered ? current.park : null}
              onPick={pick}
              text={parkText}
            />
          </>
        )}
        {why && <p className="rv-why">{why}</p>}
      </div>

      {answered && (
        <>
          <FeedbackBox
            correct={right && !shown}
            message={
              right
                ? shown
                  ? 'Right, but you read the text, so this line comes round again to hear.'
                  : 'Right first time.'
                : 'This line comes round again.'
            }
          />
          <div className="g-actions">
            <Button autoFocus onClick={drill.advance}>
              Next
            </Button>
          </div>
        </>
      )}
    </>
  )
}

/**
 * Step 3: hear a voicemail with directions, then answer what to do at each
 * landmark and where to park. A route is mastered only when every question is
 * right first time without reading the text.
 */
function RouteStep({ drill, speech }: { drill: Drill<Route>; speech: Speech }) {
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

  if (!current) {
    return (
      <div className="g-done">
        <FeedbackBox
          correct
          message={`Done. You followed all ${routes.length} routes by ear, every question right first time. Best streak: ${drill.state.bestStreak}.`}
        />
        <div className="g-actions">
          <Button onClick={drill.restart}>Practise again</Button>
        </div>
      </div>
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

  return (
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
        {current.stops.map((stop, i) => (
          <li key={stop.landmark} className="rv-question">
            <GlossedText className="rv-question-text" text={stop.question} />
            <Choices
              className="rv-turns"
              options={TURNS}
              label={stop.question}
              picked={turns[i] ?? null}
              answer={checked ? stop.turn : null}
              onPick={(turn) => pickTurn(i, turn)}
              text={turnText}
              arrow={(t) => TURN_ARROW[t]}
            />
            {checked && !turnsRight[i] && <p className="rv-why">{explain(stop)}</p>}
          </li>
        ))}

        <li className="rv-question">
          <GlossedText className="rv-question-text" text={PARK_QUESTION} />
          <Choices
            className="rv-parks"
            options={PARK_PLACES}
            label={PARK_QUESTION}
            picked={park}
            answer={checked ? current.park : null}
            onPick={(place) => !checked && setPark(place)}
            text={parkText}
          />
          {checked && !parkRight && park && <p className="rv-why">{explainPark(park, current.decoy)}</p>}
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
    </>
  )
}
