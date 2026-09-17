import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { Tag } from '../../../components/Tag'
import { useDrill } from '../../useDrill'
import { items, RULE_EXPLANATIONS, RULE_LABELS, type VerbItem } from './data'
import './WerkwoordenNu.css'

const STORE_KEY = 'nl.schrijven.werkwoorden'

function isCorrect(item: VerbItem, choice: string): boolean {
  return choice === item.answer || (item.accept ?? []).includes(choice)
}

export function WerkwoordenNu() {
  const drill = useDrill(STORE_KEY, items)
  const [index, setIndex] = useState(0)
  const [locked, setLocked] = useState(false)

  const current = drill.current
  const currentId = current?.id

  // Reset the dial for each new presentation of an item.
  useEffect(() => {
    setIndex(0)
    setLocked(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, drill.round])

  if (!drill.loaded) return null

  const correct = current ? isCorrect(current, current.options[index]) : false

  function move(delta: number) {
    if (locked || !current) return
    const count = current.options.length
    setIndex((i) => (i + delta + count) % count)
  }

  function lockIn() {
    if (!current || locked) return
    setLocked(true)
    if (isCorrect(current, current.options[index])) drill.hit()
    else drill.miss()
  }

  function retry() {
    setLocked(false)
  }

  if (!current) {
    return (
      <Shell title="Werkwoorden nu" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Klaar! Alle ${items.length} werkwoorden had je in één keer goed. Beste streak: ${drill.state.bestStreak}.`}
          />
          <Button onClick={drill.restart}>Opnieuw oefenen</Button>
        </div>
      </Shell>
    )
  }

  const [before, after] = current.sentence.split('___')
  const choice = current.options[index]

  return (
    <Shell
      title="Werkwoorden nu"
      backTo="/schrijven"
      progress={{ value: drill.mastered, max: drill.total }}
    >
      <div className="g-row">
        <Tag>{RULE_LABELS[current.rule]}</Tag>
        <StreakBadge label="Streak" value={drill.state.streak} />
      </div>

      <p className="g-sentence wn-sentence">
        <GlossedText text={before} />
        <span className={`wn-slot ${locked ? (correct ? 'wn-slot-ok' : 'wn-slot-alert') : ''}`}>
          {choice}
        </span>
        <GlossedText text={after} />
      </p>

      <p className="g-hint">
        Hele werkwoord: <strong>{current.infinitive}</strong>{' '}
        <span className="wn-gloss">({current.gloss})</span>
      </p>

      <div className="wn-dial">
        <button
          className="wn-dial-step"
          onClick={() => move(-1)}
          disabled={locked}
          aria-label="Vorige vorm"
        >
          &#9650;
        </button>
        <div
          className="wn-drum"
          role="radiogroup"
          aria-label="Kies de juiste vorm"
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') {
              e.preventDefault()
              move(-1)
            } else if (e.key === 'ArrowDown') {
              e.preventDefault()
              move(1)
            }
          }}
        >
          {current.options.map((option, i) => (
            <button
              key={option}
              role="radio"
              aria-checked={i === index}
              tabIndex={i === index ? 0 : -1}
              className={`wn-drum-option ${i === index ? 'wn-drum-option-active' : ''}`}
              disabled={locked}
              onClick={() => setIndex(i)}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          className="wn-dial-step"
          onClick={() => move(1)}
          disabled={locked}
          aria-label="Volgende vorm"
        >
          &#9660;
        </button>
      </div>

      {locked && (
        <>
          <FeedbackBox
            correct={correct}
            message={
              correct
                ? RULE_EXPLANATIONS[current.rule]
                : `${RULE_EXPLANATIONS[current.rule]} Hier moet het "${current.answer}" zijn.`
            }
          />
          {!correct && current.accept && current.accept.length > 0 && (
            <p className="g-answer-key">
              Ook goed: <strong>{current.accept.join(', ')}</strong>
            </p>
          )}
        </>
      )}

      <div className="g-actions">
        {!locked && <Button onClick={lockIn}>Vastzetten</Button>}
        {locked && correct && <Button onClick={drill.advance}>Volgende</Button>}
        {locked && !correct && <Button onClick={retry}>Probeer opnieuw</Button>}
      </div>
    </Shell>
  )
}
