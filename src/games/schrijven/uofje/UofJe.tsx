import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { Tag } from '../../../components/Tag'
import { useGameProgress } from '../../useGameProgress'
import {
  CONSISTENCY_RULE,
  isToggle,
  messages,
  REGISTER_RULES,
  type Register,
  type RegisterMessage,
} from './data'
import './UofJe.css'

const STORE_KEY = 'nl.schrijven.uofje'

interface UofJeState {
  done: boolean
  completedIds: string[]
  streak: number
  bestStreak: number
}

const initialState: UofJeState = {
  done: false,
  completedIds: [],
  streak: 0,
  bestStreak: 0,
}

function nextMessage(completedIds: string[]): RegisterMessage | null {
  return messages.find((m) => !completedIds.includes(m.id)) ?? null
}

/** Toggles start on a mix of registers, so there is always something to fix. */
function startingChoices(message: RegisterMessage): Register[] {
  const toggles = message.parts.filter(isToggle)
  const wrong: Register = message.register === 'formeel' ? 'informeel' : 'formeel'
  return toggles.map((_, i) => (i % 2 === 0 ? wrong : message.register))
}

export function UofJe() {
  const { state, loaded, save } = useGameProgress<UofJeState>(STORE_KEY, initialState)
  const [current, setCurrent] = useState<RegisterMessage | null>(null)
  const [choices, setChoices] = useState<Register[]>([])
  const [checked, setChecked] = useState(false)
  const [missed, setMissed] = useState(false)

  useEffect(() => {
    if (!loaded) return
    const first = nextMessage(state.completedIds)
    setCurrent(first)
    setChoices(first ? startingChoices(first) : [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  if (!loaded) return null

  const wrongCount = current ? choices.filter((c) => c !== current.register).length : 0
  const correct = checked && wrongCount === 0

  function toggleAt(toggleIndex: number) {
    if (checked) return
    setChoices((prev) =>
      prev.map((value, i) =>
        i === toggleIndex ? (value === 'formeel' ? 'informeel' : 'formeel') : value,
      ),
    )
  }

  function check() {
    if (!current) return
    setChecked(true)
    if (choices.some((c) => c !== current.register)) {
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
      done: completedIds.length === messages.length,
    })
  }

  function retry() {
    setChecked(false)
  }

  function advance() {
    const next = nextMessage(state.completedIds)
    setCurrent(next)
    setChoices(next ? startingChoices(next) : [])
    setChecked(false)
    setMissed(false)
  }

  function restart() {
    save({ ...initialState, bestStreak: state.bestStreak })
    setCurrent(messages[0])
    setChoices(startingChoices(messages[0]))
    setChecked(false)
    setMissed(false)
  }

  if (!current) {
    return (
      <Shell title="U of je" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Klaar! Alle ${messages.length} berichten staan in het juiste register.`}
          />
          <Button onClick={restart}>Opnieuw oefenen</Button>
        </div>
      </Shell>
    )
  }

  let toggleIndex = -1

  return (
    <Shell
      title="U of je"
      backTo="/schrijven"
      progress={{ value: state.completedIds.length, max: messages.length }}
    >
      <div className="g-row">
        <Tag>{current.register === 'formeel' ? 'Formeel?' : 'Informeel?'}</Tag>
        <StreakBadge label="Streak" value={state.streak} />
      </div>

      <div className="uj-envelope">
        <div className="uj-envelope-row">
          <span className="g-label">Aan</span>
          <strong>{current.recipient}</strong>
        </div>
        <div className="uj-envelope-row">
          <span className="g-label">Onderwerp</span>
          <span>{current.subject}</span>
        </div>
      </div>

      <p className="g-hint">
        Tik op de gemarkeerde woorden tot het hele bericht bij deze ontvanger past.
      </p>

      <div className="g-worksheet uj-message">
        {current.parts.map((part, i) => {
          if (!isToggle(part)) {
            return <GlossedText key={i} text={part} className="uj-text" />
          }
          toggleIndex += 1
          const index = toggleIndex
          const value = choices[index]
          const wrong = checked && value !== current.register
          const right = checked && value === current.register
          return (
            <button
              key={i}
              className={`uj-toggle ${wrong ? 'uj-toggle-alert' : ''} ${right ? 'uj-toggle-ok' : ''}`}
              onClick={() => toggleAt(index)}
              disabled={checked}
              aria-label={`${part.label}: ${part[value]}, tik om te wisselen`}
            >
              {part[value]}
            </button>
          )
        })}
      </div>

      {checked && (
        <FeedbackBox
          correct={correct}
          message={
            correct
              ? `Klopt: ${current.recipient} is ${current.relation}. ${REGISTER_RULES[current.register]}`
              : `Nog ${wrongCount} ${wrongCount === 1 ? 'woord past' : 'woorden passen'} niet. ${current.recipient} is ${current.relation}. ${REGISTER_RULES[current.register]} ${CONSISTENCY_RULE}`
          }
        />
      )}

      <div className="g-actions">
        {!checked && <Button onClick={check}>Controleer</Button>}
        {checked && correct && <Button onClick={advance}>Volgende</Button>}
        {checked && !correct && <Button onClick={retry}>Pas aan</Button>}
      </div>
    </Shell>
  )
}
