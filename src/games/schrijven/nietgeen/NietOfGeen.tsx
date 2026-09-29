import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { Tag } from '../../../components/Tag'
import { useDrill } from '../../useDrill'
import { items, RULE_EXPLANATIONS, RULE_LABELS, type NegItem, type NegWord } from './data'
import './NietOfGeen.css'

const STORE_KEY = 'nl.schrijven.nietgeen'

/** The full sentence with the negation in place, for the answer key. */
function renderAnswer(item: NegItem): string {
  const words = [...item.tokens]
  words.splice(item.position, 0, item.word)
  return words.join(' ') + item.end
}

export function NietOfGeen() {
  const drill = useDrill(STORE_KEY, items)
  const [word, setWord] = useState<NegWord | null>(null)
  const [placed, setPlaced] = useState<number | null>(null)

  const current = drill.current
  const currentId = current?.id

  // Clear the choice for each new presentation, including a repeat of a missed item.
  useEffect(() => {
    setWord(null)
    setPlaced(null)
  }, [currentId, drill.round])

  if (!drill.loaded) return null

  const wordOk = current ? word === current.word : false
  const placeOk = current ? placed === current.position : false
  const correct = wordOk && placeOk

  function place(gap: number) {
    if (!current || word === null || placed !== null) return
    setPlaced(gap)
    if (word === current.word && gap === current.position) drill.hit()
    else drill.miss()
  }

  function retry() {
    setPlaced(null)
    setWord(null)
  }

  if (!current) {
    return (
      <Shell title="Niet of geen" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Done. You placed all ${items.length} negations right first time. Best streak: ${drill.state.bestStreak}.`}
          />
          <Button onClick={drill.restart}>Practise again</Button>
        </div>
      </Shell>
    )
  }

  const gaps = current.tokens.length + 1

  return (
    <Shell
      title="Niet of geen"
      backTo="/schrijven"
      progress={{ value: drill.mastered, max: drill.total }}
    >
      <div className="g-row">
        <Tag>{placed === null ? 'Choose and place' : RULE_LABELS[current.rule]}</Tag>
        <StreakBadge label="Streak" value={drill.state.streak} />
      </div>

      <p className="g-hint">
        Make this sentence negative: <strong className="ng-english">{current.english}</strong>
      </p>

      <div>
        <span className="g-label">1 &middot; Which word?</span>
        <div className="g-chips">
          {(['niet', 'geen'] as NegWord[]).map((option) => (
            <button
              key={option}
              className={`g-chip ${word === option ? 'g-chip-selected' : ''}`}
              disabled={placed !== null}
              aria-pressed={word === option}
              onClick={() => setWord(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="g-label">2 &middot; Where in the sentence?</span>
        <div className="g-sentence ng-sentence">
          {Array.from({ length: gaps }).map((_, gap) => (
            <span key={`gap-${gap}`} className="ng-gap-wrap">
              <button
                className={`ng-gap ${placed === gap ? (correct ? 'ng-gap-ok' : 'ng-gap-alert') : ''}`}
                disabled={word === null || placed !== null}
                aria-label={`Place ${word ?? 'the word'} in position ${gap + 1}`}
                onClick={() => place(gap)}
              >
                {placed === gap ? word : '+'}
              </button>
              {gap < current.tokens.length && (
                <GlossedText className="ng-token" text={current.tokens[gap]} />
              )}
            </span>
          ))}
          <span className="ng-token">{current.end}</span>
        </div>
      </div>

      {placed !== null && (
        <>
          <FeedbackBox
            correct={correct}
            message={
              correct
                ? RULE_EXPLANATIONS[current.rule]
                : !wordOk
                  ? `This sentence needs "${current.word}". ${RULE_EXPLANATIONS[current.rule]}`
                  : `The word is right, the position is not. ${RULE_EXPLANATIONS[current.rule]}`
            }
          />
          {!correct && (
            <p className="g-answer-key">
              Right sentence: <strong>{renderAnswer(current)}</strong>
            </p>
          )}
        </>
      )}

      <div className="g-actions">
        {placed !== null && correct && <Button onClick={drill.advance}>Next</Button>}
        {placed !== null && !correct && <Button onClick={retry}>Try again</Button>}
      </div>
    </Shell>
  )
}
