import { useEffect, useMemo, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { Tag } from '../../../components/Tag'
import { Tooltip } from '../../../components/Tooltip'
import { useDrill } from '../../useDrill'
import { shuffle } from '../../normalize'
import { situations, STRUCTURE_RULE } from './data'
import './BerichtBouwstenen.css'

const STORE_KEY = 'nl.schrijven.bouwstenen'

export function BerichtBouwstenen() {
  const drill = useDrill(STORE_KEY, situations)
  const [picks, setPicks] = useState<(number | null)[]>([])
  const [checked, setChecked] = useState(false)

  const current = drill.current
  const currentId = current?.id

  // Shuffle each slot's pile so the right block is not always in the same place,
  // and reshuffle when a missed message comes round again.
  const piles = useMemo(
    () => (current ? current.slots.map((slot) => shuffle(slot.options)) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentId, drill.round],
  )

  // Clear the picks for each new presentation, including a repeat of a missed message.
  useEffect(() => {
    setPicks(current ? current.slots.map(() => null) : [])
    setChecked(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, drill.round])

  if (!drill.loaded) return null

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
    if (bad > 0) drill.miss()
    else drill.hit()
  }

  function retry() {
    setChecked(false)
  }

  if (!current) {
    return (
      <Shell title="Bericht bouwstenen" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Done. You built all ${situations.length} messages right first time.`}
          />
          <Button onClick={drill.restart}>Practise again</Button>
        </div>
      </Shell>
    )
  }

  return (
    <Shell
      title="Bericht bouwstenen"
      backTo="/schrijven"
      progress={{ value: drill.mastered, max: drill.total }}
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
          {/* A block is a radio, not a <button>: a button cannot hold the focusable
              word tooltips, and the Dutch on it needs them like any other Dutch. */}
          <div className="bb-pile" role="radiogroup" aria-label={slot.gloss}>
            {piles[slotIndex].map((option, optionIndex) => {
              const selected = picks[slotIndex] === optionIndex
              const mark = checked && selected ? (option.ok ? 'bb-block-ok' : 'bb-block-alert') : ''
              return (
                <div
                  key={option.text}
                  role="radio"
                  tabIndex={0}
                  aria-checked={selected}
                  aria-disabled={checked}
                  className={`bb-block ${selected ? 'bb-block-selected' : ''} ${mark} ${checked ? 'bb-block-locked' : ''}`}
                  onClick={() => pickBlock(slotIndex, optionIndex)}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter' && e.key !== ' ') return
                    e.preventDefault()
                    pickBlock(slotIndex, optionIndex)
                  }}
                >
                  <GlossedText text={option.text} />
                </div>
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
        {checked && allOk && <Button onClick={drill.advance}>Next message</Button>}
        {checked && !allOk && <Button onClick={retry}>Adjust</Button>}
      </div>
    </Shell>
  )
}
