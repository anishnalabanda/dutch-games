import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { Tag } from '../../../components/Tag'
import { useDrill } from '../../useDrill'
import {
  CONJUGATIONS,
  FORM_ROWS,
  items,
  RULE_EXPLANATIONS,
  RULE_LABELS,
  type FormKey,
  type VerbItem,
} from './data'
import './WerkwoordenNu.css'

const STORE_KEY = 'nl.schrijven.werkwoorden'

function isCorrect(item: VerbItem, choice: string): boolean {
  return choice === item.answer || (item.accept ?? []).includes(choice)
}

/**
 * Which row of the table this sentence was actually asking for. An inversion
 * item spells its answer exactly like the ik-form (werk jij? / ik werk), so the
 * rule decides, not the spelling.
 */
function isHere(item: VerbItem, key: FormKey | 'vraag', form: string): boolean {
  if (item.rule === 'inversie-jij') return key === 'vraag'
  return key !== 'vraag' && form.toLowerCase() === item.answer.toLowerCase()
}

/**
 * The whole present tense of this verb, shown once the answer is right: the
 * item asks for one form, and seeing the other five is what turns it into a
 * rule instead of a fact.
 */
function FormTable({ item }: { item: VerbItem }) {
  const conj = CONJUGATIONS[item.infinitive]
  if (!conj) return null
  return (
    <div className="wn-forms">
      <p className="wn-forms-title">
        Every present-tense form of <strong>{item.infinitive}</strong> ({item.gloss})
      </p>
      <p className="wn-forms-legend">The form this sentence needed is marked.</p>
      <dl className="wn-forms-grid">
        {FORM_ROWS.map((row) => (
          <div
            key={row.key}
            className={`wn-forms-row ${isHere(item, row.key, conj[row.key]) ? 'wn-forms-row-here' : ''}`}
          >
            <dt>
              <span className="wn-forms-pronoun">{row.pronoun}</span>{' '}
              <strong className="wn-forms-form">{conj[row.key]}</strong>
            </dt>
            <dd>{row.role}</dd>
          </div>
        ))}
        <div className={`wn-forms-row ${isHere(item, 'vraag', conj.vraag) ? 'wn-forms-row-here' : ''}`}>
          <dt>
            <strong className="wn-forms-form">{conj.vraag}</strong>
          </dt>
          <dd>question with the verb first, so the -t drops</dd>
        </div>
      </dl>
      <p className="wn-forms-note">{conj.note}</p>
    </div>
  )
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
            message={`Done. You got all ${items.length} verbs right first time. Best streak: ${drill.state.bestStreak}.`}
          />
          <Button onClick={drill.restart}>Practise again</Button>
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
        Infinitive: <strong>{current.infinitive}</strong>{' '}
        <span className="wn-gloss">({current.gloss})</span>
      </p>

      <div className="wn-dial">
        <button
          className="wn-dial-step"
          onClick={() => move(-1)}
          disabled={locked}
          aria-label="Previous form"
        >
          &#9650;
        </button>
        <div
          className="wn-drum"
          role="radiogroup"
          aria-label="Choose the right form"
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
          aria-label="Next form"
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
                : `${RULE_EXPLANATIONS[current.rule]} Here it has to be "${current.answer}".`
            }
          />
          {correct && <FormTable item={current} />}
          {!correct && current.accept && current.accept.length > 0 && (
            <p className="g-answer-key">
              Also correct: <strong>{current.accept.join(', ')}</strong>
            </p>
          )}
        </>
      )}

      <div className="g-actions">
        {!locked && <Button onClick={lockIn}>Lock in</Button>}
        {locked && correct && <Button onClick={drill.advance}>Next</Button>}
        {locked && !correct && <Button onClick={retry}>Try again</Button>}
      </div>
    </Shell>
  )
}
