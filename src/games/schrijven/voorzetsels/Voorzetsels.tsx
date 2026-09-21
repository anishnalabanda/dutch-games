import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { Tag } from '../../../components/Tag'
import { useGameProgress } from '../../useGameProgress'
import { matchesAnswer } from '../../normalize'
import { items, MONTHS, RULE_EXPLANATIONS, type PrepItem } from './data'
import './Voorzetsels.css'

const STORE_KEY = 'nl.schrijven.voorzetsels'

interface VoorzetselsState {
  done: boolean
  completedIds: string[]
  streak: number
  bestStreak: number
}

const initialState: VoorzetselsState = { done: false, completedIds: [], streak: 0, bestStreak: 0 }

function nextItem(completedIds: string[]): PrepItem | null {
  return items.find((item) => !completedIds.includes(item.id)) ?? null
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

/** Analog clock face; hands drawn from the item's hour and minute. */
function ClockFace({ hour, minute }: { hour: number; minute: number }) {
  const minuteAngle = minute * 6 - 90
  const hourAngle = ((hour % 12) + minute / 60) * 30 - 90
  const point = (angle: number, length: number) => ({
    x: 50 + length * Math.cos((angle * Math.PI) / 180),
    y: 50 + length * Math.sin((angle * Math.PI) / 180),
  })
  const minuteEnd = point(minuteAngle, 34)
  const hourEnd = point(hourAngle, 22)

  return (
    <svg viewBox="0 0 100 100" className="vz-clock" role="img" aria-label={`${hour}:${pad(minute)}`}>
      <circle cx="50" cy="50" r="46" className="vz-clock-face" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = i * 30 - 90
        const from = point(angle, 38)
        const to = point(angle, 43)
        return (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            className={i % 3 === 0 ? 'vz-tick vz-tick-major' : 'vz-tick'}
          />
        )
      })}
      <line x1="50" y1="50" x2={hourEnd.x} y2={hourEnd.y} className="vz-hand vz-hand-hour" />
      <line x1="50" y1="50" x2={minuteEnd.x} y2={minuteEnd.y} className="vz-hand vz-hand-minute" />
      <circle cx="50" cy="50" r="2.5" className="vz-pin" />
    </svg>
  )
}

export function Voorzetsels() {
  const { state, loaded, save } = useGameProgress<VoorzetselsState>(STORE_KEY, initialState)
  const [current, setCurrent] = useState<PrepItem | null>(null)
  const [typed, setTyped] = useState('')
  const [picked, setPicked] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [missed, setMissed] = useState(false)

  useEffect(() => {
    if (!loaded) return
    setCurrent(nextItem(state.completedIds))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  if (!loaded) return null

  const correct = !current
    ? false
    : current.kind === 'zin'
      ? picked === current.answer
      : matchesAnswer(typed, current.answer, current.accept)

  function complete(item: PrepItem) {
    const firstTry = !missed
    const completedIds = state.completedIds.includes(item.id)
      ? state.completedIds
      : [...state.completedIds, item.id]
    const streak = firstTry ? state.streak + 1 : 0
    save({
      ...state,
      completedIds,
      streak,
      bestStreak: Math.max(state.bestStreak, streak),
      done: completedIds.length === items.length,
    })
  }

  function check() {
    if (!current || current.kind === 'zin' || typed.trim() === '') return
    setChecked(true)
    if (!matchesAnswer(typed, current.answer, current.accept)) {
      setMissed(true)
      save({ ...state, streak: 0 })
      return
    }
    complete(current)
  }

  function pick(option: string) {
    if (!current || current.kind !== 'zin' || checked) return
    setPicked(option)
    setChecked(true)
    if (option !== current.answer) {
      setMissed(true)
      save({ ...state, streak: 0 })
      return
    }
    complete(current)
  }

  function retry() {
    setChecked(false)
    setPicked(null)
  }

  function advance() {
    setCurrent(nextItem(state.completedIds))
    setTyped('')
    setPicked(null)
    setChecked(false)
    setMissed(false)
  }

  function restart() {
    save({ ...initialState, bestStreak: state.bestStreak })
    setCurrent(items[0])
    setTyped('')
    setPicked(null)
    setChecked(false)
    setMissed(false)
  }

  if (!current) {
    return (
      <Shell title="Op maandag om negen uur" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Done. All ${items.length} prepositions, times and dates are right. Best streak: ${state.bestStreak}.`}
          />
          <Button onClick={restart}>Practise again</Button>
        </div>
      </Shell>
    )
  }

  return (
    <Shell
      title="Op maandag om negen uur"
      backTo="/schrijven"
      progress={{ value: state.completedIds.length, max: items.length }}
    >
      <div className="g-row">
        <Tag>
          {current.kind === 'klok'
            ? 'What time is it?'
            : current.kind === 'kalender'
              ? 'Which date?'
              : 'Which preposition?'}
        </Tag>
        <StreakBadge label="Streak" value={state.streak} />
      </div>

      {current.kind === 'zin' ? (
        <>
          <p className="g-hint">{current.english}</p>
          <p className="g-sentence vz-sentence">
            <GlossedText text={current.before} />
            <span className={`vz-blank ${checked ? (correct ? 'vz-blank-ok' : 'vz-blank-alert') : ''}`}>
              {picked ?? '…'}
            </span>
            <GlossedText text={current.after} />
          </p>
          <div className="g-chips">
            {current.options.map((option) => (
              <button
                key={option}
                className={`g-chip ${picked === option ? 'g-chip-selected' : ''}`}
                disabled={checked}
                onClick={() => pick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="vz-widget">
            {current.kind === 'klok' ? (
              <>
                <ClockFace hour={current.hour} minute={current.minute} />
                <span className="vz-digital">
                  {current.hour}.{pad(current.minute)} uur
                </span>
              </>
            ) : (
              <div className="vz-calendar">
                <span className="vz-calendar-month">{MONTHS[current.month - 1]}</span>
                <span className="vz-calendar-day">{current.day}</span>
                <span className="vz-calendar-weekday">
                  {current.weekday} {current.year}
                </span>
              </div>
            )}
          </div>
          <div>
            <label className="g-label" htmlFor="vz-answer">
              Write the whole phrase in Dutch, preposition included
            </label>
            <input
              id="vz-answer"
              className="g-input"
              value={typed}
              disabled={checked}
              autoComplete="off"
              spellCheck={false}
              placeholder={current.kind === 'klok' ? 'om kwart over acht' : 'op 3 maart 1990'}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') check()
              }}
            />
          </div>
        </>
      )}

      {checked && (
        <>
          <FeedbackBox correct={correct} message={RULE_EXPLANATIONS[current.rule]} />
          {!correct && (
            <p className="g-answer-key">
              Answer: <strong>{current.answer}</strong>
              {current.kind !== 'zin' && current.accept.length > 0 && (
                <>, also correct: {current.accept.join(' / ')}</>
              )}
            </p>
          )}
        </>
      )}

      <div className="g-actions">
        {!checked && current.kind !== 'zin' && (
          <Button onClick={check} disabled={typed.trim() === ''}>
            Check
          </Button>
        )}
        {checked && correct && <Button onClick={advance}>Next</Button>}
        {checked && !correct && <Button onClick={retry}>Try again</Button>}
      </div>
    </Shell>
  )
}
