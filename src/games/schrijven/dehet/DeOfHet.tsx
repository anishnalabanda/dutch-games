import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { Tag } from '../../../components/Tag'
import { useGameProgress } from '../../useGameProgress'
import { ADJ_RULES, ARTICLE_PATTERNS, items, type Article, type NounItem } from './data'
import './DeOfHet.css'

const STORE_KEY = 'nl.schrijven.dehet'

interface DeHetState {
  done: boolean
  completedIds: string[]
  streak: number
  bestStreak: number
}

const initialState: DeHetState = { done: false, completedIds: [], streak: 0, bestStreak: 0 }

function nextItem(completedIds: string[]): NounItem | null {
  return items.find((item) => !completedIds.includes(item.id)) ?? null
}

export function DeOfHet() {
  const { state, loaded, save } = useGameProgress<DeHetState>(STORE_KEY, initialState)
  const [current, setCurrent] = useState<NounItem | null>(null)
  const [sorted, setSorted] = useState<Article | null>(null)
  const [ending, setEnding] = useState<string | null>(null)
  const [missed, setMissed] = useState(false)

  useEffect(() => {
    if (!loaded) return
    setCurrent(nextItem(state.completedIds))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  if (!loaded) return null

  const articleOk = current ? sorted === current.article : false
  const needsFollow = Boolean(current?.follow)
  const endingOk = current?.follow ? ending === current.follow.answer : true
  const finished = sorted !== null && articleOk && (!needsFollow || ending !== null)
  const correct = articleOk && endingOk

  function complete(item: NounItem, firstTry: boolean) {
    const completedIds = state.completedIds.includes(item.id)
      ? state.completedIds
      : [...state.completedIds, item.id]
    const streak = firstTry ? state.streak + 1 : 0
    save({
      ...state,
      completedIds,
      streak,
      bestStreak: Math.max(state.bestStreak, streak),
      done: completedIds.length === items.length,
    })
  }

  function sort(choice: Article) {
    if (!current || sorted !== null) return
    setSorted(choice)
    if (choice !== current.article) {
      setMissed(true)
      save({ ...state, streak: 0 })
      return
    }
    // A word without a follow-up question is finished as soon as it is sorted.
    if (!current.follow) complete(current, !missed)
  }

  function chooseEnding(option: string) {
    if (!current?.follow || ending !== null) return
    setEnding(option)
    if (option !== current.follow.answer) {
      setMissed(true)
      save({ ...state, streak: 0 })
      return
    }
    complete(current, !missed)
  }

  function retry() {
    setSorted(null)
    setEnding(null)
  }

  function advance() {
    setCurrent(nextItem(state.completedIds))
    setSorted(null)
    setEnding(null)
    setMissed(false)
  }

  function restart() {
    save({ ...initialState, bestStreak: state.bestStreak })
    setCurrent(items[0])
    setSorted(null)
    setEnding(null)
    setMissed(false)
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
          <FeedbackBox correct message={`Done. All ${items.length} words are sorted correctly.`} />
          <Button onClick={restart}>Practise again</Button>
        </div>
      </Shell>
    )
  }

  return (
    <Shell
      title="De of het"
      backTo="/schrijven"
      progress={{ value: state.completedIds.length, max: items.length }}
    >
      <div className="g-row">
        <Tag>{sorted === null ? 'Sort the word' : 'Which ending?'}</Tag>
        <StreakBadge label="Streak" value={state.streak} />
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
        {sorted !== null && correct && finished && <Button onClick={advance}>Next</Button>}
        {sorted !== null && !correct && <Button onClick={retry}>Try again</Button>}
      </div>
    </Shell>
  )
}
