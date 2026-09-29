import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { Tag } from '../../../components/Tag'
import { useDrill } from '../../useDrill'
import {
  CONNECTOR_MEANINGS,
  items,
  ORDER_RULES,
  SUBORDINATING,
  type ConnItem,
  type Connector,
} from './data'
import './Verbindingswoorden.css'

const STORE_KEY = 'nl.schrijven.voegwoorden'

/** Clause 2 with the finite verb moved to the end. */
function verbToEnd(item: ConnItem): string[] {
  const words = [...item.clause2]
  const [verb] = words.splice(item.verbIndex, 1)
  words.push(verb)
  return words
}

export function Verbindingswoorden() {
  const drill = useDrill(STORE_KEY, items)
  const [pick, setPick] = useState<Connector | null>(null)
  const [order, setOrder] = useState<'same' | 'end' | null>(null)

  const current = drill.current
  const currentId = current?.id

  // Clear the choice for each new presentation, including a repeat of a missed item.
  useEffect(() => {
    setPick(null)
    setOrder(null)
  }, [currentId, drill.round])

  if (!drill.loaded) return null

  const connectorOk = current ? pick === current.connector : false
  const needsMove = current ? SUBORDINATING.includes(current.connector) : false
  const orderOk = order !== null && ((needsMove && order === 'end') || (!needsMove && order === 'same'))
  const correct = connectorOk && orderOk

  function choose(option: Connector) {
    if (order !== null) return
    setPick(option)
  }

  function decideOrder(choice: 'same' | 'end') {
    if (!current || pick === null || order !== null) return
    setOrder(choice)
    const rightConnector = pick === current.connector
    const rightOrder = SUBORDINATING.includes(current.connector) ? choice === 'end' : choice === 'same'
    if (rightConnector && rightOrder) drill.hit()
    else drill.miss()
  }

  function retry() {
    setOrder(null)
    setPick(null)
  }

  if (!current) {
    return (
      <Shell title="Verbindingswoorden" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Done. You joined all ${items.length} sentences right first time. Best streak: ${drill.state.bestStreak}.`}
          />
          <Button onClick={drill.restart}>Practise again</Button>
        </div>
      </Shell>
    )
  }

  // The strip shows the order the player picked, so the verb move is visible.
  const shownWords = order === 'end' ? verbToEnd(current) : current.clause2
  const movedIndex = order === 'end' ? shownWords.length - 1 : current.verbIndex

  let message = ''
  if (order !== null) {
    if (correct) {
      message = `${CONNECTOR_MEANINGS[current.connector]}. ${needsMove ? ORDER_RULES.sub : ORDER_RULES.main}`
    } else if (!connectorOk) {
      message = `This sentence needs "${current.connector}": ${CONNECTOR_MEANINGS[current.connector]}.`
    } else {
      message = needsMove ? ORDER_RULES.sub : ORDER_RULES.main
    }
  }

  return (
    <Shell
      title="Verbindingswoorden"
      backTo="/schrijven"
      progress={{ value: drill.mastered, max: drill.total }}
    >
      <div className="g-row">
        <Tag>{pick === null ? 'Choose the connector' : 'Get the word order right'}</Tag>
        <StreakBadge label="Streak" value={drill.state.streak} />
      </div>

      <p className="g-hint">{current.english}</p>

      <div className="vw-strips">
        <div className="vw-strip">
          <GlossedText text={current.clause1} />
        </div>
        <div className={`vw-connector ${pick ? 'vw-connector-filled' : ''}`}>{pick ?? '···'}</div>
        <div className="vw-strip vw-strip-second">
          {shownWords.map((word, i) => (
            <GlossedText
              key={`${word}-${i}`}
              className={`vw-word ${i === movedIndex ? 'vw-word-verb' : ''}`}
              text={word}
            />
          ))}
          <span className="vw-word">.</span>
        </div>
      </div>

      <div>
        <span className="g-label">1 &middot; Which connector?</span>
        <div className="g-chips">
          {current.options.map((option) => (
            <button
              key={option}
              className={`g-chip ${pick === option ? 'g-chip-selected' : ''}`}
              disabled={order !== null}
              aria-pressed={pick === option}
              onClick={() => choose(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="g-label">2 &middot; What happens to the finite verb?</span>
        <div className="g-chips">
          <button
            className={`g-chip ${order === 'same' ? 'g-chip-selected' : ''}`}
            disabled={pick === null || order !== null}
            onClick={() => decideOrder('same')}
          >
            Order stays the same
          </button>
          <button
            className={`g-chip ${order === 'end' ? 'g-chip-selected' : ''}`}
            disabled={pick === null || order !== null}
            onClick={() => decideOrder('end')}
          >
            Verb moves to the end
          </button>
        </div>
      </div>

      {order !== null && (
        <>
          <FeedbackBox correct={correct} message={message} />
          {!correct && (
            <p className="g-answer-key">
              Right sentence:{' '}
              <strong>
                {current.clause1} {current.connector}{' '}
                {(SUBORDINATING.includes(current.connector) ? verbToEnd(current) : current.clause2).join(
                  ' ',
                )}
                .
              </strong>
            </p>
          )}
        </>
      )}

      <div className="g-actions">
        {order !== null && correct && <Button onClick={drill.advance}>Next</Button>}
        {order !== null && !correct && <Button onClick={retry}>Try again</Button>}
      </div>
    </Shell>
  )
}
