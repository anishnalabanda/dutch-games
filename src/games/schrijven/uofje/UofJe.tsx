import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { Tag } from '../../../components/Tag'
import { useDrill } from '../../useDrill'
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

/** Toggles start on a mix of registers, so there is always something to fix. */
function startingChoices(message: RegisterMessage): Register[] {
  const toggles = message.parts.filter(isToggle)
  const wrong: Register = message.register === 'formeel' ? 'informeel' : 'formeel'
  return toggles.map((_, i) => (i % 2 === 0 ? wrong : message.register))
}

export function UofJe() {
  const drill = useDrill(STORE_KEY, messages)
  const [choices, setChoices] = useState<Register[]>([])
  const [checked, setChecked] = useState(false)

  const current = drill.current
  const currentId = current?.id

  // Reset the toggles for each new presentation, including a repeat of a missed message.
  useEffect(() => {
    setChoices(current ? startingChoices(current) : [])
    setChecked(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, drill.round])

  if (!drill.loaded) return null

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
    if (choices.some((c) => c !== current.register)) drill.miss()
    else drill.hit()
  }

  function retry() {
    setChecked(false)
  }

  if (!current) {
    return (
      <Shell title="U of je" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Done. You put all ${messages.length} messages in the right register first time. Best streak: ${drill.state.bestStreak}.`}
          />
          <Button onClick={drill.restart}>Practise again</Button>
        </div>
      </Shell>
    )
  }

  let toggleIndex = -1

  return (
    <Shell
      title="U of je"
      backTo="/schrijven"
      progress={{ value: drill.mastered, max: drill.total }}
    >
      <div className="g-row">
        <Tag>{current.register === 'formeel' ? 'Formal?' : 'Informal?'}</Tag>
        <StreakBadge label="Streak" value={drill.state.streak} />
      </div>

      <div className="uj-envelope">
        <div className="uj-envelope-row">
          <span className="g-label">To</span>
          <strong>{current.recipient}</strong>
        </div>
        <div className="uj-envelope-row">
          <span className="g-label">Subject</span>
          <span>{current.subject}</span>
        </div>
      </div>

      <p className="g-hint">
        Tap the marked words until the whole message fits this recipient.
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
              aria-label={`${part.label}: ${part[value]}, tap to switch`}
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
              ? `Right: ${current.recipient} is ${current.relation}. ${REGISTER_RULES[current.register]}`
              : `${wrongCount} ${wrongCount === 1 ? 'word does' : 'words do'} not fit yet. ${current.recipient} is ${current.relation}. ${REGISTER_RULES[current.register]} ${CONSISTENCY_RULE}`
          }
        />
      )}

      <div className="g-actions">
        {!checked && <Button onClick={check}>Check</Button>}
        {checked && correct && <Button onClick={drill.advance}>Next</Button>}
        {checked && !correct && <Button onClick={retry}>Adjust</Button>}
      </div>
    </Shell>
  )
}
