import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../../components/Button'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { GlossedText } from '../../../components/GlossedText'
import { StreakBadge } from '../../../components/StreakBadge'
import type { Drill } from '../../useDrill'
import type { DutchSpeech } from '../speech'
import { sentenceOptions, type ListenSentence } from './zinnen'
import '../listening.css'

/**
 * Step 2 of a word game: one sentence is said, pick what it means. The wrong
 * meanings differ only in the detail to catch, so one known word is not enough.
 * Reading the sentence first counts as a miss, as in the word drill.
 */
export function SentenceStep({
  items,
  drill,
  speech,
  onNext,
}: {
  items: ListenSentence[]
  drill: Drill<ListenSentence>
  speech: DutchSpeech
  onNext: () => void
}) {
  const [chosen, setChosen] = useState<string | null>(null)
  const [shown, setShown] = useState(false)
  const current = drill.current
  const currentId = current?.id
  const { speak } = speech

  // A new order for every presentation, including a repeat of a missed sentence.
  const options = useMemo(() => (current ? sentenceOptions(current) : []), [current, drill.round])

  useEffect(() => {
    setChosen(null)
    setShown(false)
    if (current) speak(current.nl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, drill.round])

  if (!current) {
    return (
      <div className="g-done">
        <FeedbackBox
          correct
          message={`Done. You understood all ${items.length} sentences by ear, first time. Best streak: ${drill.state.bestStreak}.`}
        />
        <div className="g-actions">
          <Button onClick={onNext}>Next: conversations</Button>
          <Button variant="secondary" onClick={drill.restart}>
            Practise again
          </Button>
        </div>
      </div>
    )
  }

  const answered = chosen !== null
  const right = chosen === current.en
  const textVisible = answered || shown || !speech.supported

  function choose(option: string) {
    if (answered || !current) return
    setChosen(option)
    if (option === current.en) drill.hit()
    else if (!shown) drill.miss()
  }

  function showText() {
    // Reading the sentence is not hearing it: it comes round again.
    if (!shown && !answered) drill.miss()
    setShown(true)
  }

  return (
    <>
      <div className="g-row">
        <span className="g-hint">Listen to the sentence, then choose what it means.</span>
        <StreakBadge label="Streak" value={drill.state.streak} />
      </div>

      <div className="ls-board">
        {speech.supported && (
          <div className="g-actions">
            <Button onClick={() => speak(current.nl)}>&#9654; Play again</Button>
            <Button variant="secondary" onClick={() => speak(current.nl, { slow: true })}>
              Slower
            </Button>
          </div>
        )}
        {textVisible ? (
          <p className="ls-transcript ls-sentence" lang="nl">
            <GlossedText text={current.nl} />
          </p>
        ) : (
          <button type="button" className="ls-reveal" onClick={showText}>
            Show the text (counts as a miss)
          </button>
        )}
      </div>

      <div className="ls-meanings" role="group" aria-label="Meaning">
        {options.map((option) => {
          const state = !answered
            ? ''
            : option === current.en
              ? 'g-chip-ok'
              : option === chosen
                ? 'g-chip-alert'
                : ''
          return (
            <button
              key={option}
              type="button"
              className={`g-chip lw-option ${state}`}
              disabled={answered}
              onClick={() => choose(option)}
            >
              {option}
            </button>
          )
        })}
      </div>

      {answered && (
        <>
          <FeedbackBox
            correct={right && !shown}
            message={
              right
                ? shown
                  ? 'Right, but you read the text, so this sentence comes round again to hear.'
                  : `It means: ${current.en}`
                : `It means: ${current.en} It comes round again.`
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
