import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { Tag } from '../../../components/Tag'
import { useDrill } from '../../useDrill'
import { ADJ_RULES, ARTICLE_PATTERNS, items, type Article } from './data'
import './DeOfHet.css'

const STORE_KEY = 'nl.schrijven.dehet'

export function DeOfHet() {
  const drill = useDrill(STORE_KEY, items)
  const [sorted, setSorted] = useState<Article | null>(null)
  const [ending, setEnding] = useState<string | null>(null)

  const current = drill.current
  const currentId = current?.id

  // Clear both steps for each new presentation, including a repeat of a missed word.
  useEffect(() => {
    setSorted(null)
    setEnding(null)
  }, [currentId, drill.round])

  if (!drill.loaded) return null

  const articleOk = current ? sorted === current.article : false
  const needsFollow = Boolean(current?.follow)
  const endingOk = current?.follow ? ending === current.follow.answer : true
  const finished = sorted !== null && articleOk && (!needsFollow || ending !== null)
  const correct = articleOk && endingOk

  function sort(choice: Article) {
    if (!current || sorted !== null) return
    setSorted(choice)
    if (choice !== current.article) {
      drill.miss()
      return
    }
    // A word without a follow-up question is finished as soon as it is sorted.
    if (!current.follow) drill.hit()
  }

  function chooseEnding(option: string) {
    if (!current?.follow || ending !== null) return
    setEnding(option)
    if (option !== current.follow.answer) {
      drill.miss()
      return
    }
    drill.hit()
  }

  function retry() {
    setSorted(null)
    setEnding(null)
  }

  if (!current) {
    return (
      <Shell title="De of het" backTo="/schrijven">
        <div className="g-done">
          <div className="g-worksheet">
            <h4>Remember</h4>
            {ARTICLE_PATTERNS.map((pattern) => (
              <p key={pattern}>{pattern}</p>
            ))}
          </div>
          <FeedbackBox
            correct
            message={`Done. You sorted all ${items.length} words right first time. Best streak: ${drill.state.bestStreak}.`}
          />
          <Button onClick={drill.restart}>Practise again</Button>
        </div>
      </Shell>
    )
  }

  return (
    <Shell
      title="De of het"
      backTo="/schrijven"
      progress={{ value: drill.mastered, max: drill.total }}
    >
      <div className="g-row">
        <Tag>{sorted === null ? 'Sort the word' : 'Which ending?'}</Tag>
        <StreakBadge label="Streak" value={drill.state.streak} />
      </div>

      <div className="dh-card">
        <span className="dh-noun">{current.noun}</span>
        <span className="dh-gloss">{current.gloss}</span>
      </div>

      <div className="dh-lanes">
        {(['de', 'het'] as Article[]).map((lane) => {
          const picked = sorted === lane
          const mark = picked ? (articleOk ? 'dh-lane-ok' : 'dh-lane-alert') : ''
          return (
            <button
              key={lane}
              className={`dh-lane ${mark}`}
              disabled={sorted !== null}
              onClick={() => sort(lane)}
            >
              <span className="dh-lane-article">{lane}</span>
              <span className="dh-lane-word">{picked ? current.noun : ''}</span>
            </button>
          )
        })}
      </div>

      {sorted !== null && articleOk && current.follow && (
        <div className="dh-follow">
          <span className="g-label">
            Complete it with &ldquo;{current.follow.adjective}&rdquo;
          </span>
          <p className="g-sentence dh-phrase">
            <GlossedText text={current.follow.before} />
            <span className="dh-blank">{ending ?? '…'}</span>
            <GlossedText text={current.follow.after} />
          </p>
          <div className="g-chips">
            {current.follow.options.map((option) => (
              <button
                key={option}
                className={`g-chip ${ending === option ? 'g-chip-selected' : ''}`}
                disabled={ending !== null}
                onClick={() => chooseEnding(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {sorted !== null && (!articleOk || finished) && (
        <FeedbackBox
          correct={correct}
          message={
            !articleOk
              ? `It is "${current.article} ${current.noun}". ${current.hint}`
              : current.follow
                ? ADJ_RULES[current.follow.rule]
                : current.hint
          }
        />
      )}

      <div className="g-actions">
        {sorted !== null && correct && finished && <Button onClick={drill.advance}>Next</Button>}
        {sorted !== null && !correct && <Button onClick={retry}>Try again</Button>}
      </div>
    </Shell>
  )
}
