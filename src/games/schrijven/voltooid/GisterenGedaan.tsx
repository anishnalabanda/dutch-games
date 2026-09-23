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
  ENDING_RULES,
  ENDING_TRAP,
  GE_RULES,
  items,
  KIND_EXPLANATIONS,
  KIND_LABELS,
  KOFSCHIP_LETTERS,
  type CardRule,
  type PerfectItem,
} from './data'
import './GisterenGedaan.css'

const STORE_KEY = 'nl.schrijven.voltooid'

/** One "in this case → do this" line of the reference card. */
function RuleRows({ rules }: { rules: CardRule[] }) {
  return (
    <dl className="vg-rules">
      {rules.map((rule) => (
        <div key={rule.when} className="vg-rule">
          <dt>{rule.when}</dt>
          <dd>
            <strong>{rule.result}</strong>
            <span className="vg-rule-example">{rule.example}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}

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
  // Both halves have to be filled in before Check is allowed, so without this
  // there is no way out of an item whose participle you simply do not know.
  const [revealed, setRevealed] = useState(false)

  const current = drill.current
  const currentId = current?.id

  // Clear both slots for each new presentation of an item.
  useEffect(() => {
    setAux(null)
    setParticiple('')
    setChecked(false)
    setRevealed(false)
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

  /** Shows the answer. The item counts as missed, so it comes round again. */
  function giveUp() {
    if (!current || revealed) return
    setRevealed(true)
    // Drop whatever was typed, so the locked field cannot sit there
    // contradicting the answer now shown in the sentence.
    setParticiple('')
    if (!checked) drill.miss()
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
  const locked = checked || revealed

  let message = ''
  if (revealed) {
    message = `${AUX_EXPLANATIONS[current.auxKind]} ${KIND_EXPLANATIONS[current.kind]}`
  } else if (checked && !allOk) {
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
          {/* A revealed answer keeps the neutral amber: it is the right answer,
              so marking it red would say the opposite of what it is. */}
          <span
            className={`vg-slot ${revealed || !checked ? '' : auxOk ? 'vg-slot-ok' : 'vg-slot-alert'}`}
          >
            {(revealed ? current.aux : aux) ?? '\u00a0'}
          </span>
          <GlossedText text={current.middle} />
          <span
            className={`vg-slot vg-slot-wide ${
              revealed || !checked ? '' : participleOk ? 'vg-slot-ok' : 'vg-slot-alert'
            }`}
          >
            {revealed
              ? current.participle
              : participle.trim() === ''
                ? '\u00a0'
                : participle.trim()}
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
              disabled={locked}
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
          disabled={locked}
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

      {/* The reference card: both decisions that build a participle, each one
          written as the case on the left and what to do on the right. */}
      <div className="vg-card">
        <p className="vg-recipe">
          ge <span>+</span> stem <span>+</span> t / d
        </p>

        <div className="vg-card-part">
          <div className="vg-card-head">
            <span className="g-label">1 &middot; The ending</span>
            <div className="vg-kofschip-letters" aria-label="'t kofschip: t, k, f, s, ch, p">
              {KOFSCHIP_LETTERS.map((letter) => (
                <span key={letter} className="vg-kofschip-letter">
                  {letter}
                </span>
              ))}
            </div>
          </div>
          <RuleRows rules={ENDING_RULES} />
          <p className="vg-trap">{ENDING_TRAP}</p>
        </div>

        <div className="vg-card-part">
          <span className="g-label">2 &middot; The ge-</span>
          <RuleRows rules={GE_RULES} />
        </div>
      </div>

      {locked && (
        <>
          <FeedbackBox correct={allOk} message={message} />
          {revealed && (
            <p className="g-answer-key">
              Right answer:{' '}
              <strong>
                {current.aux} {current.participle}
              </strong>
            </p>
          )}
        </>
      )}

      <div className="g-actions">
        {!locked && (
          <Button onClick={check} disabled={aux === null || participle.trim() === ''}>
            Check
          </Button>
        )}
        {checked && !allOk && !revealed && <Button onClick={retry}>Try again</Button>}
        {!revealed && !allOk && (
          <Button variant="secondary" onClick={giveUp}>
            Give up
          </Button>
        )}
        {(allOk || revealed) && <Button onClick={drill.advance}>Next</Button>}
      </div>
    </Shell>
  )
}
