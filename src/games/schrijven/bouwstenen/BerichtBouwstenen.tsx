import { useEffect, useMemo, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { Tag } from '../../../components/Tag'
import { Tooltip } from '../../../components/Tooltip'
import { useGameProgress } from '../../useGameProgress'
import { shuffle } from '../../normalize'
import { situations, STRUCTURE_RULE, type Situation } from './data'
import './BerichtBouwstenen.css'

const STORE_KEY = 'nl.schrijven.bouwstenen'

interface BouwstenenState {
  done: boolean
  completedIds: string[]
  bestFirstTry: number
}

const initialState: BouwstenenState = { done: false, completedIds: [], bestFirstTry: 0 }

function nextSituation(completedIds: string[]): Situation | null {
  return situations.find((s) => !completedIds.includes(s.id)) ?? null
}

export function BerichtBouwstenen() {
  const { state, loaded, save } = useGameProgress<BouwstenenState>(STORE_KEY, initialState)
  const [current, setCurrent] = useState<Situation | null>(null)
  const [picks, setPicks] = useState<(number | null)[]>([])
  const [checked, setChecked] = useState(false)

  // Shuffle each slot's pile so the right block is not always in the same place.
  const piles = useMemo(
    () => (current ? current.slots.map((slot) => shuffle(slot.options)) : []),
    [current],
  )

  useEffect(() => {
    if (!loaded) return
    const first = nextSituation(state.completedIds)
    setCurrent(first)
    setPicks(first ? first.slots.map(() => null) : [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  if (!loaded) return null

  const chosen = current
    ? picks.map((pick, slotIndex) => (pick === null ? null : piles[slotIndex][pick]))
    : []
  const complete = chosen.length > 0 && chosen.every((c) => c !== null)
  const wrongPicks = chosen.filter((c) => c !== null && !c.ok)
  const allOk = checked && complete && wrongPicks.length === 0

  function pickBlock(slotIndex: number, optionIndex: number) {
    if (checked) return
    setPicks((prev) => prev.map((p, i) => (i === slotIndex ? optionIndex : p)))
  }

  function check() {
    if (!current || !complete) return
    setChecked(true)
    const bad = chosen.filter((c) => c !== null && !c.ok).length
    if (bad > 0) return
    const completedIds = state.completedIds.includes(current.id)
      ? state.completedIds
      : [...state.completedIds, current.id]
    save({
      ...state,
      completedIds,
      bestFirstTry: state.bestFirstTry,
      done: completedIds.length === situations.length,
    })
  }

  function retry() {
    setChecked(false)
  }

  function advance() {
    const next = nextSituation(state.completedIds)
    setCurrent(next)
    setPicks(next ? next.slots.map(() => null) : [])
    setChecked(false)
  }

  function restart() {
    save({ ...initialState, bestFirstTry: state.bestFirstTry })
    setCurrent(situations[0])
    setPicks(situations[0].slots.map(() => null))
    setChecked(false)
  }

  if (!current) {
    return (
      <Shell title="Bericht bouwstenen" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Done. You built all ${situations.length} messages correctly.`}
          />
          <Button onClick={restart}>Practise again</Button>
        </div>
      </Shell>
    )
  }

  return (
    <Shell
      title="Bericht bouwstenen"
      backTo="/schrijven"
      progress={{ value: state.completedIds.length, max: situations.length }}
    >
      <div className="g-row">
        <Tag>{current.register === 'formeel' ? 'Formal message' : 'Informal message'}</Tag>
      </div>

      <div className="bb-brief">
        <h3 className="bb-title">{current.title}</h3>
        <p className="g-hint">
          To: <strong>{current.recipient}</strong>
        </p>
        <ul className="bb-points">
          {current.brief.map((point) => (
            <li key={point}>
              <GlossedText text={point} />
            </li>
          ))}
        </ul>
      </div>

      {/* The message so far, on the worksheet surface. */}
      <div className="g-worksheet bb-preview">
        {current.slots.map((slot, i) => (
          <p key={slot.label} className={chosen[i] ? '' : 'bb-preview-empty'}>
            {chosen[i] ? (
              <GlossedText text={chosen[i].text} />
            ) : (
              `[${slot.label.toLowerCase()}]`
            )}
          </p>
        ))}
      </div>

      {current.slots.map((slot, slotIndex) => (
        <div key={slot.label} className="bb-slot">
          <span className="g-label">
            <Tooltip content={slot.gloss}>
              <span className="bb-slot-name">{slot.label}</span>
            </Tooltip>
          </span>
          <div className="bb-pile">
            {piles[slotIndex].map((option, optionIndex) => {
              const selected = picks[slotIndex] === optionIndex
              const mark = checked && selected ? (option.ok ? 'bb-block-ok' : 'bb-block-alert') : ''
              return (
                <button
                  key={option.text}
                  className={`bb-block ${selected ? 'bb-block-selected' : ''} ${mark}`}
                  disabled={checked}
                  aria-pressed={selected}
                  onClick={() => pickBlock(slotIndex, optionIndex)}
                >
                  {option.text}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {checked && (
        <>
          <FeedbackBox
            correct={allOk}
            message={allOk ? `Well built. ${STRUCTURE_RULE}` : STRUCTURE_RULE}
          />
          {!allOk && (
            <ul className="bb-why">
              {chosen.map((option, i) =>
                option && !option.ok ? (
                  <li key={current.slots[i].label}>
                    <strong>{current.slots[i].label}:</strong> {option.why}
                  </li>
                ) : null,
              )}
            </ul>
          )}
        </>
      )}

      <div className="g-actions">
        {!checked && (
          <Button onClick={check} disabled={!complete}>
            Check
          </Button>
        )}
        {checked && allOk && <Button onClick={advance}>Next message</Button>}
        {checked && !allOk && <Button onClick={retry}>Adjust</Button>}
      </div>
    </Shell>
  )
}
