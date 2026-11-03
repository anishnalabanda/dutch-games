import { useEffect, useState } from 'react'
import { Shell } from '../../components/Shell'
import { Button } from '../../components/Button'
import { FeedbackBox } from '../../components/FeedbackBox'
import { GlossedText } from '../../components/GlossedText'
import { StreakBadge } from '../../components/StreakBadge'
import { useCurrentGame } from '../currentGame'
import { useDrill } from '../useDrill'
import { Choices } from '../luisteren/Choices'
import { themeFromKey } from './data'
import type { KnmQuestion } from './types'
import './KnmQuiz.css'

const NO_QUESTIONS: KnmQuestion[] = []
const LETTERS = ['A', 'B', 'C', 'D']

/**
 * One game per theme of the owner's KNM book, all on this component: the
 * manifest entry on screen says which theme. The exam's own shape: a question,
 * two to four lettered options, pick one. A or 1 picks the first option, and so
 * on, so a whole theme can be done from the keyboard.
 */
export function KnmQuiz() {
  const meta = useCurrentGame()
  const key = meta?.id ?? ''
  const theme = themeFromKey(key)
  const items = theme?.questions ?? NO_QUESTIONS
  const drill = useDrill(key, items)
  const [picked, setPicked] = useState<string | null>(null)
  const current = drill.current
  const currentId = current?.id

  useEffect(() => {
    setPicked(null)
  }, [currentId, drill.round])

  const answered = picked !== null
  const answer = current ? String(current.answer) : null

  function pick(option: string) {
    if (!current || answered) return
    setPicked(option)
    if (option === answer) drill.hit()
    else drill.miss()
  }

  // Letter or number keys answer; Enter on the focused Next button moves on.
  useEffect(() => {
    if (!current || answered) return
    const count = current.options.length
    function onKey(e: KeyboardEvent) {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const k = e.key.toUpperCase()
      const index = LETTERS.indexOf(k) >= 0 ? LETTERS.indexOf(k) : Number(k) - 1
      if (Number.isInteger(index) && index >= 0 && index < count) {
        e.preventDefault()
        pick(String(index))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, drill.round, answered])

  if (!meta || !theme) return <p>Unknown game.</p>
  if (!drill.loaded) return null

  const indexes = current ? current.options.map((_, i) => String(i)) : []
  const right = picked === answer

  return (
    <Shell title={meta.title} backTo="/knm" progress={{ value: drill.mastered, max: drill.total }}>
      {!current ? (
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Done. You answered all ${items.length} questions of this theme right first time. Best streak: ${drill.state.bestStreak}.`}
          />
          <div className="g-actions">
            <Button onClick={drill.restart}>Practise again</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="g-row">
            <span className="g-hint">
              Book: thema {theme.book}, vraag {current.n}
            </span>
            <StreakBadge label="Streak" value={drill.state.streak} />
          </div>

          <div className="knm-card">
            <GlossedText className="knm-question" text={current.question} />
            <Choices
              className="knm-options"
              options={indexes}
              label="Answer"
              picked={picked}
              answer={answered ? answer : null}
              onPick={pick}
              text={(i) => current.options[Number(i)]}
              arrow={(i) => LETTERS[Number(i)]}
            />
          </div>

          {answered && (
            <>
              <FeedbackBox
                correct={right}
                message={[
                  right
                    ? `${LETTERS[current.answer]} is right.`
                    : `The answer is ${LETTERS[current.answer]}, marked in green. This question comes round again.`,
                  current.bookAnswer !== undefined
                    ? `The book's answer key says ${LETTERS[current.bookAnswer]}; this app uses ${LETTERS[current.answer]}.`
                    : '',
                  current.note ?? '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
              <div className="g-actions">
                <Button autoFocus onClick={drill.advance}>
                  Next
                </Button>
              </div>
            </>
          )}
        </>
      )}

      <p className="g-hint">
        These are the questions from your book. The real exam asks about everyday situations, often
        with a photo, so do the DUO practice exams on inburgeren.nl as well.
      </p>
    </Shell>
  )
}
