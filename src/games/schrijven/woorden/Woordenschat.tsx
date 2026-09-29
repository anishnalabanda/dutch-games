import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { Tag } from '../../../components/Tag'
import { useDrill } from '../../useDrill'
import { normalize } from '../../normalize'
import { items, SECONDS_PER_ITEM, THEME_LABELS, type VocabItem } from './data'
import './Woordenschat.css'

const STORE_KEY = 'nl.schrijven.woorden'

type Verdict = 'goed' | 'lidwoord' | 'fout' | 'tijd'

/** Bare nouns count, but the row says the article out loud: de/het is graded too. */
function judge(item: VocabItem, typed: string): Verdict {
  const answer = normalize(typed)
  if (answer === normalize(item.nl)) return 'goed'
  if (item.bare && answer === normalize(item.bare)) return 'lidwoord'
  return 'fout'
}

export function Woordenschat() {
  const drill = useDrill(STORE_KEY, items)
  const [typed, setTyped] = useState('')
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [left, setLeft] = useState(SECONDS_PER_ITEM)

  const current = drill.current
  const currentId = current?.id
  const { miss } = drill

  // Fresh row for each new presentation, including a repeat of a missed word.
  useEffect(() => {
    setTyped('')
    setVerdict(null)
    setLeft(SECONDS_PER_ITEM)
  }, [currentId, drill.round])

  // The row flips when the clock runs out: the answer is shown, and the word comes round again.
  useEffect(() => {
    if (!current || verdict !== null) return
    if (left <= 0) {
      setVerdict('tijd')
      miss()
      return
    }
    const id = window.setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => window.clearTimeout(id)
  }, [left, current, verdict, miss])

  if (!drill.loaded) return null

  function check() {
    if (!current || typed.trim() === '' || verdict !== null) return
    const result = judge(current, typed)
    setVerdict(result)
    // A missing article is still a miss: de and het are marked in the exam.
    if (result === 'goed') drill.hit()
    else drill.miss()
  }

  function retry() {
    setVerdict(null)
    setTyped('')
    setLeft(SECONDS_PER_ITEM)
  }

  if (!current) {
    return (
      <Shell title="Woordenschat per thema" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Done. You wrote all ${items.length} words right first time. Best streak: ${drill.state.bestStreak}.`}
          />
          <Button onClick={drill.restart}>Practise again</Button>
        </div>
      </Shell>
    )
  }

  const pct = Math.max(0, Math.round((left / SECONDS_PER_ITEM) * 100))
  const solved = verdict === 'goed' || verdict === 'lidwoord'

  return (
    <Shell
      title="Woordenschat per thema"
      backTo="/schrijven"
      progress={{ value: drill.mastered, max: drill.total }}
    >
      <div className="g-row">
        <Tag>{THEME_LABELS[current.theme]}</Tag>
        <StreakBadge label="Streak" value={drill.state.streak} />
      </div>

      {/* Departure board row: the English rolls in, the Dutch has to be typed. */}
      <div className={`ws-row ${verdict ? 'ws-row-flipped' : ''}`}>
        <span className="ws-row-label">English</span>
        <span className="ws-row-en">{current.en}</span>
        <span className="ws-row-label">Dutch</span>
        {verdict ? (
          <span className={`ws-row-nl ${solved ? 'ws-row-nl-ok' : 'ws-row-nl-alert'}`}>
            {current.nl}
          </span>
        ) : (
          <input
            className="g-input ws-input"
            value={typed}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            aria-label="Type the Dutch word"
            placeholder="type the Dutch word"
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') check()
            }}
          />
        )}
      </div>

      <div className="ws-clock" aria-hidden="true">
        <div className="ws-clock-bar" style={{ width: `${verdict ? 0 : pct}%` }} />
      </div>
      <p className="g-hint">{verdict ? 'Row flipped.' : `${left} seconds left.`}</p>

      {verdict && (
        <FeedbackBox
          correct={verdict === 'goed'}
          message={
            verdict === 'goed'
              ? 'Spelled right, with the correct article.'
              : verdict === 'lidwoord'
                ? `The word is right. Write the article with it: "${current.nl}". De and het are marked in the exam.`
                : verdict === 'tijd'
                  ? `Time was up. The word is "${current.nl}".`
                  : `Not yet. The word is "${current.nl}".`
          }
        />
      )}

      <div className="g-actions">
        {!verdict && (
          <Button onClick={check} disabled={typed.trim() === ''}>
            Check
          </Button>
        )}
        {solved && <Button onClick={drill.advance}>Next</Button>}
        {(verdict === 'fout' || verdict === 'tijd') && (
          <Button onClick={retry}>Once more</Button>
        )}
      </div>
    </Shell>
  )
}
