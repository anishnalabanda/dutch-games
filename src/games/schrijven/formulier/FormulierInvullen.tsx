import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { Tag } from '../../../components/Tag'
import { Tooltip } from '../../../components/Tooltip'
import { useDrill } from '../../useDrill'
import { fieldMatches, fields, FORMAT_HELP, personas } from './data'
import './FormulierInvullen.css'

const STORE_KEY = 'nl.schrijven.formulier'

function emptyForm(): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f.id, '']))
}

export function FormulierInvullen() {
  const drill = useDrill(STORE_KEY, personas)
  const [values, setValues] = useState<Record<string, string>>(emptyForm)
  const [checked, setChecked] = useState(false)

  const current = drill.current
  const currentId = current?.id

  // Clear the form for each new presentation, including a repeat of a missed one.
  useEffect(() => {
    setValues(emptyForm())
    setChecked(false)
  }, [currentId, drill.round])

  if (!drill.loaded) return null

  const results = current
    ? fields.map((field) => ({
        field,
        ok: fieldMatches(field.type, values[field.id] ?? '', current.values[field.id]),
      }))
    : []
  const wrong = results.filter((r) => !r.ok)
  const allOk = checked && wrong.length === 0

  function check() {
    if (!current) return
    setChecked(true)
    const bad = fields.filter(
      (field) => !fieldMatches(field.type, values[field.id] ?? '', current.values[field.id]),
    )
    if (bad.length > 0) drill.miss()
    else drill.hit()
  }

  if (!current) {
    return (
      <Shell title="Formulier invullen" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Done. You filled in all ${personas.length} forms right first time.`}
          />
          <Button onClick={drill.restart}>Practise again</Button>
        </div>
      </Shell>
    )
  }

  return (
    <Shell
      title="Formulier invullen"
      backTo="/schrijven"
      progress={{ value: drill.mastered, max: drill.total }}
    >
      <div className="g-row">
        <Tag>Form {drill.mastered + 1} of {drill.total}</Tag>
      </div>

      <div className="g-worksheet fi-persona">
        <h4>Your details</h4>
        {current.intro.map((line, i) => (
          <p key={i}>
            <GlossedText text={line} />
          </p>
        ))}
        <p className="fi-fictional">These details are made up, for practice only.</p>
      </div>

      <div className="fi-form">
        {fields.map((field) => {
          const result = results.find((r) => r.field.id === field.id)
          const status = checked ? (result?.ok ? 'fi-field-ok' : 'fi-field-alert') : ''
          return (
            <div key={field.id} className={`fi-field ${status}`}>
              <label className="fi-field-label" htmlFor={`fi-${field.id}`}>
                <Tooltip content={field.gloss}>
                  <span className="fi-field-name">{field.label}</span>
                </Tooltip>
              </label>
              <input
                id={`fi-${field.id}`}
                className="fi-field-input"
                value={values[field.id] ?? ''}
                placeholder={field.placeholder}
                disabled={allOk}
                autoComplete="off"
                spellCheck={false}
                onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
              />
              {checked && !result?.ok && (
                <p className="fi-field-help">{FORMAT_HELP[field.type]}</p>
              )}
            </div>
          )
        })}
      </div>

      {checked && (
        <FeedbackBox
          correct={allOk}
          message={
            allOk
              ? 'Every field is right, including how the date, the postcode and the BSN are written.'
              : `${wrong.length} of the ${fields.length} fields ${wrong.length === 1 ? 'is' : 'are'} not right yet. Check the field itself and how it is written.`
          }
        />
      )}

      <div className="g-actions">
        {!allOk && <Button onClick={check}>Check</Button>}
        {allOk && <Button onClick={drill.advance}>Next form</Button>}
      </div>
    </Shell>
  )
}
