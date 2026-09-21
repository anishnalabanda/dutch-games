import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { Tag } from '../../../components/Tag'
import { useDrill } from '../../useDrill'
import { normalize } from '../../normalize'
import {
  AUX_EXPLANATIONS,
  items,
  KIND_EXPLANATIONS,
  KIND_LABELS,
  KOFSCHIP_LETTERS,
  type PerfectItem,
} from './data'
import './GisterenGedaan.css'

const STORE_KEY = 'nl.schrijven.voltooid'

/** Which half went wrong, so the feedback can name the actual mistake. */
function grade(item: PerfectItem, aux: string | null, participle: string) {
  return {
    auxOk: aux === item.aux,
    participleOk: normalize(participle) === normalize(item.participle),
  }
}

export function GisterenGedaan() {
  const drill = useDrill(STORE_KEY, items)
  const [aux, setAux] = useState<string | null>(null)
  const [participle, setParticiple] = useState('')
  const [checked, setChecked] = useState(false)

  const current = drill.current
  const currentId = current?.id

  // Clear both slots for each new presentation of an item.
  useEffect(() => {
    setAux(null)
    setParticiple('')
    setChecked(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, drill.round])

  if (!drill.loaded) return null

  function check() {
    if (!current || aux === null || participle.trim() === '') return
    setChecked(true)
    const { auxOk, participleOk } = grade(current, aux, participle)
    if (auxOk && participleOk) drill.hit()
    else drill.miss()
  }

  function retry() {
    setChecked(false)
    setParticiple('')
  }

  if (!current) {
    return (
      <Shell title="Gisteren gedaan" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Done. You got all ${items.length} perfect-tense sentences right first time. Best streak: ${drill.state.bestStreak}.`}
          />
          <Button onClick={drill.restart}>Practise again</Button>
        </div>
      </Shell>
    )
  }

  const { auxOk, participleOk } = grade(current, aux, participle)
  const allOk = checked && auxOk && participleOk

  let message = ''
  if (checked && !allOk) {
    const wrongParts: string[] = []
    if (!auxOk) wrongParts.push(`The auxiliary is "${current.aux}". ${AUX_EXPLANATIONS[current.auxKind]}`)
    if (!participleOk)
      wrongParts.push(`The participle is "${current.participle}". ${KIND_EXPLANATIONS[current.kind]}`)
    message = wrongParts.join(' ')
  } else if (allOk) {
    message = `${AUX_EXPLANATIONS[current.auxKind]} ${KIND_EXPLANATIONS[current.kind]}`
  }

  return (
    <Shell
      title="Gisteren gedaan"
      backTo="/schrijven"
      progress={{ value: drill.mastered, max: drill.total }}
    >
      <div className="g-row">
        <Tag>{KIND_LABELS[current.kind]}</Tag>
        <StreakBadge label="Streak" value={drill.state.streak} />
      </div>

      {/* Boarding pass: the auxiliary in the left stub, the participle in the right. */}
      <div className="vg-pass">
        <div className="vg-pass-line">
          <GlossedText text={current.before} />
          <span className={`vg-slot ${checked ? (auxOk ? 'vg-slot-ok' : 'vg-slot-alert') : ''}`}>
            {aux ?? '\u00a0'}
          </span>
          <GlossedText text={current.middle} />
          <span
            className={`vg-slot vg-slot-wide ${
              checked ? (participleOk ? 'vg-slot-ok' : 'vg-slot-alert') : ''
            }`}
          >
            {participle.trim() === '' ? '\u00a0' : participle.trim()}
          </span>
          <span>{current.after}</span>
        </div>
        <p className="g-hint">
          Infinitive: <strong>{current.infinitive}</strong>{' '}
          <span className="vg-gloss">({current.gloss})</span>
        </p>
      </div>

      <div>
        <span className="g-label">1 &middot; Auxiliary verb (hebben or zijn)</span>
        <div className="g-chips">
          {current.auxOptions.map((option) => (
            <button
              key={option}
              className={`g-chip ${aux === option ? 'g-chip-selected' : ''}`}
              disabled={checked}
              aria-pressed={aux === option}
              onClick={() => setAux(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="g-label" htmlFor="vg-participle">
          2 &middot; Past participle
        </label>
        <input
          id="vg-participle"
          className="g-input"
          value={participle}
          disabled={checked}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="type the participle"
          onChange={(e) => setParticiple(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') check()
          }}
        />
      </div>

      <div className="vg-kofschip" aria-label="'t kofschip: the letters that take -t">
        <span className="g-label">&apos;t kofschip</span>
        <div className="vg-kofschip-letters">
          {KOFSCHIP_LETTERS.map((letter) => (
            <span key={letter} className="vg-kofschip-letter">
              {letter}
            </span>
          ))}
        </div>
        <p className="g-hint">
          Does the stem end in one of these letters? Then -t. Otherwise -d. Irregular verbs do not
          follow this rule.
        </p>
      </div>

      {checked && <FeedbackBox correct={allOk} message={message} />}

      <div className="g-actions">
        {!checked && (
          <Button onClick={check} disabled={aux === null || participle.trim() === ''}>
            Check
          </Button>
        )}
        {checked && allOk && <Button onClick={drill.advance}>Next</Button>}
        {checked && !allOk && <Button onClick={retry}>Try again</Button>}
      </div>
    </Shell>
  )
}
