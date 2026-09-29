import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { Tag } from '../../../components/Tag'
import { useDrill } from '../../useDrill'
import { matchesAnswer } from '../../normalize'
import { items, TYPE_RULES } from './data'
import './VragenStellen.css'

const STORE_KEY = 'nl.schrijven.vragen'

export function VragenStellen() {
  const drill = useDrill(STORE_KEY, items)
  const [typed, setTyped] = useState('')
  const [checked, setChecked] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const current = drill.current
  const currentId = current?.id

  // Clear the input for each new presentation, including a repeat of a missed item.
  useEffect(() => {
    setTyped('')
    setChecked(false)
    setShowHint(false)
  }, [currentId, drill.round])

  if (!drill.loaded) return null

  const correct = current ? matchesAnswer(typed, current.question, current.accept) : false

  function check() {
    if (!current || typed.trim() === '') return
    setChecked(true)
    if (matchesAnswer(typed, current.question, current.accept)) drill.hit()
    else drill.miss()
  }

  // A question written with the hint open is not right first time, so it comes round again.
  function openHint() {
    setShowHint(true)
    drill.miss()
  }

  function retry() {
    setChecked(false)
  }

  if (!current) {
    return (
      <Shell title="Vragen stellen" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Done. You wrote all ${items.length} questions right first time. Best streak: ${drill.state.bestStreak}.`}
          />
          <Button onClick={drill.restart}>Practise again</Button>
        </div>
      </Shell>
    )
  }

  return (
    <Shell
      title="Vragen stellen"
      backTo="/schrijven"
      progress={{ value: drill.mastered, max: drill.total }}
    >
      <div className="g-row">
        <Tag>{current.type === 'janee' ? 'Yes/no question' : 'Question word question'}</Tag>
        <StreakBadge label="Streak" value={drill.state.streak} />
      </div>

      <p className="g-hint">
        This is the answer. Write the question that asks about the{' '}
        <span className="vs-focus-legend">marked part</span>.
      </p>

      <div className="vs-answer">
        <span className="g-label">Answer</span>
        <p className="vs-answer-text">
          <GlossedText text={current.before} />
          <GlossedText text={current.focus} className="vs-focus" />
          <GlossedText text={current.after} />
        </p>
      </div>

      <div>
        <label className="g-label" htmlFor="vs-question">
          Your question
        </label>
        <input
          id="vs-question"
          className="g-input vs-input"
          value={typed}
          disabled={checked}
          autoComplete="off"
          spellCheck={false}
          placeholder="Type the whole question"
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
              Model question: <strong>{current.question}</strong>
              {current.accept.length > 0 && (
                <>
                  <br />
                  Also correct: {current.accept.join(' / ')}
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
              Check
            </Button>
            {!showHint && (
              <Button variant="secondary" onClick={openHint}>
                Hint
              </Button>
            )}
          </>
        )}
        {checked && correct && <Button onClick={drill.advance}>Next</Button>}
        {checked && !correct && <Button onClick={retry}>Try again</Button>}
      </div>
    </Shell>
  )
}
