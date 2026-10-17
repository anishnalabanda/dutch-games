import { useEffect, useState } from 'react'
import { Button } from '../../../components/Button'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { GlossedText } from '../../../components/GlossedText'
import { StreakBadge } from '../../../components/StreakBadge'
import type { Drill } from '../../useDrill'
import { Choices } from '../Choices'
import type { DutchSpeech } from '../speech'
import type { Speaker } from './zinnen/types'
import type { ListenConversation } from './zinnen'
import '../listening.css'

/** One voice for both speakers, so pitch tells them apart. */
const PITCH: Record<Speaker, number> = { m: 0.8, v: 1.25 }
const SPEAKER: Record<Speaker, string> = { m: 'Man', v: 'Woman' }
const INDEXES = ['0', '1', '2'] as const

/**
 * Step 3 of a word game, the exam's shape: read the question and the three
 * options, hear a short conversation, choose. Every option is said in it, so
 * only the line that settles it gives the answer.
 */
export function ConversationStep({
  items,
  drill,
  speech,
}: {
  items: ListenConversation[]
  drill: Drill<ListenConversation>
  speech: DutchSpeech
}) {
  const [picked, setPicked] = useState<string | null>(null)
  const [shown, setShown] = useState(false)
  const current = drill.current
  const currentId = current?.id
  const { speak, stop } = speech

  // Not played on arrival: the exam has the question read first.
  useEffect(() => {
    setPicked(null)
    setShown(false)
    stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, drill.round])

  if (!current) {
    return (
      <div className="g-done">
        <FeedbackBox
          correct
          message={`Done. You answered all ${items.length} conversations by ear, first time. Best streak: ${drill.state.bestStreak}.`}
        />
        <div className="g-actions">
          <Button onClick={drill.restart}>Practise again</Button>
        </div>
      </div>
    )
  }

  const answer = String(current.answer)
  const answered = picked !== null
  const right = picked === answer
  const textVisible = answered || shown || !speech.supported

  function play(slow = false) {
    if (!current) return
    current.lines.forEach(([who, nl], i) => speak(nl, { slow, pitch: PITCH[who], queue: i > 0 }))
  }

  function pick(option: string) {
    if (answered) return
    setPicked(option)
    stop()
    if (option === answer) drill.hit()
    else if (!shown) drill.miss()
  }

  function showText() {
    // Reading the conversation is not hearing it: it comes round again.
    if (!shown && !answered) drill.miss()
    stop()
    setShown(true)
  }

  return (
    <>
      <div className="g-row">
        <span className="g-hint">Read the question, then listen to the conversation.</span>
        <StreakBadge label="Streak" value={drill.state.streak} />
      </div>

      <div className="ls-question">
        <GlossedText className="ls-question-text" text={current.question} />
        <Choices
          className="ls-choices ls-choices-stacked"
          options={INDEXES}
          label={current.question}
          picked={picked as (typeof INDEXES)[number] | null}
          answer={answered ? (answer as (typeof INDEXES)[number]) : null}
          onPick={pick}
          text={(i) => current.options[Number(i)]}
        />
      </div>

      <div className="ls-board">
        {speech.supported && (
          <div className="g-actions">
            <Button onClick={() => play()}>&#9654; Play the conversation</Button>
            <Button variant="secondary" onClick={() => play(true)}>
              Slower
            </Button>
            <Button variant="secondary" onClick={stop}>
              Stop
            </Button>
          </div>
        )}
        {textVisible ? (
          <dl className="ls-dialogue" lang="nl">
            {current.lines.map(([who, nl], i) => (
              <div key={i} className="ls-dialogue-line">
                <dt lang="en">{SPEAKER[who]}</dt>
                <dd>
                  <GlossedText text={nl} />
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <button type="button" className="ls-reveal" onClick={showText}>
            Show the text (counts as a miss)
          </button>
        )}
      </div>

      {answered && (
        <>
          <FeedbackBox
            correct={right && !shown}
            message={
              right && shown
                ? `Right, but you read the text, so this conversation comes round again. ${current.why}`
                : right
                  ? current.why
                  : `${current.why} It comes round again.`
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
