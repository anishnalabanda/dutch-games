import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { Tag } from '../../../components/Tag'
import { useDrill } from '../../useDrill'
import { normalize } from '../../normalize'
import {
  answerInContext,
  items,
  MODE_LABELS,
  RULE_EXPLANATIONS,
  RULE_LABELS,
} from './data'
import './Spellingmachine.css'

const STORE_KEY = 'nl.schrijven.spelling'

export function Spellingmachine() {
  const drill = useDrill(STORE_KEY, items)
  const [typed, setTyped] = useState('')
  const [checked, setChecked] = useState(false)

  const current = drill.current
  const currentId = current?.id

  // Empty the field for each new presentation, including a repeat of a missed word.
  useEffect(() => {
    setTyped('')
    setChecked(false)
  }, [currentId, drill.round])

  if (!drill.loaded) return null

  const correct = current ? normalize(typed) === normalize(current.to) : false

  function check() {
    if (!current || typed.trim() === '') return
    setChecked(true)
    if (normalize(typed) === normalize(current.to)) drill.hit()
    else drill.miss()
  }

  function retry() {
    setChecked(false)
    setTyped('')
  }

  if (!current) {
    return (
      <Shell title="Spellingmachine" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Done. You spelled all ${items.length} words right first time. Best streak: ${drill.state.bestStreak}.`}
          />
          <Button onClick={drill.restart}>Practise again</Button>
        </div>
      </Shell>
    )
  }

  return (
    <Shell
      title="Spellingmachine"
      backTo="/schrijven"
      progress={{ value: drill.mastered, max: drill.total }}
    >
      <div className="g-row">
        <Tag>{RULE_LABELS[current.rule]}</Tag>
        <StreakBadge label="Streak" value={drill.state.streak} />
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
              aria-label="Type the new form"
              placeholder="type here"
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
          Form for: <strong>{current.cue}</strong>
        </p>
      )}

      {checked && (
        <>
          <FeedbackBox
            correct={correct}
            message={
              correct
                ? RULE_EXPLANATIONS[current.rule]
                : `${RULE_EXPLANATIONS[current.rule]} The right answer is "${answerInContext(current)}".`
            }
          />
        </>
      )}

      <div className="g-actions">
        {!checked && (
          <Button onClick={check} disabled={typed.trim() === ''}>
            Check
          </Button>
        )}
        {checked && correct && <Button onClick={drill.advance}>Next</Button>}
        {checked && !correct && <Button onClick={retry}>Try again</Button>}
      </div>
    </Shell>
  )
}
