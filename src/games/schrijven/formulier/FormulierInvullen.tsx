import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { Tag } from '../../../components/Tag'
import { Tooltip } from '../../../components/Tooltip'
import { useGameProgress } from '../../useGameProgress'
import { fieldMatches, fields, FORMAT_HELP, personas, type Persona } from './data'
import './FormulierInvullen.css'

const STORE_KEY = 'nl.schrijven.formulier'

interface FormulierState {
  done: boolean
  completedIds: string[]
  bestScore: number
}

const initialState: FormulierState = { done: false, completedIds: [], bestScore: 0 }

function nextPersona(completedIds: string[]): Persona | null {
  return personas.find((p) => !completedIds.includes(p.id)) ?? null
}

function emptyForm(): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f.id, '']))
}

export function FormulierInvullen() {
  const { state, loaded, save } = useGameProgress<FormulierState>(STORE_KEY, initialState)
  const [current, setCurrent] = useState<Persona | null>(null)
  const [values, setValues] = useState<Record<string, string>>(emptyForm)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!loaded) return
    setCurrent(nextPersona(state.completedIds))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  if (!loaded) return null

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
    const score = fields.length - bad.length
    if (bad.length > 0) {
      save({ ...state, bestScore: Math.max(state.bestScore, score) })
      return
    }
    const completedIds = state.completedIds.includes(current.id)
      ? state.completedIds
      : [...state.completedIds, current.id]
    save({
      ...state,
      completedIds,
      bestScore: Math.max(state.bestScore, score),
      done: completedIds.length === personas.length,
    })
  }

  function advance() {
    setCurrent(nextPersona(state.completedIds))
    setValues(emptyForm())
    setChecked(false)
  }

  function restart() {
    save({ ...initialState, bestScore: state.bestScore })
    setCurrent(personas[0])
    setValues(emptyForm())
    setChecked(false)
  }

  if (!current) {
    return (
      <Shell title="Formulier invullen" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Klaar! Je hebt alle ${personas.length} formulieren foutloos ingevuld.`}
          />
          <Button onClick={restart}>Opnieuw oefenen</Button>
        </div>
      </Shell>
    )
  }

  return (
    <Shell
      title="Formulier invullen"
      backTo="/schrijven"
      progress={{ value: state.completedIds.length, max: personas.length }}
    >
      <div className="g-row">
        <Tag>Formulier {state.completedIds.length + 1} van {personas.length}</Tag>
      </div>

      <div className="g-worksheet fi-persona">
        <h4>Jouw gegevens</h4>
        {current.intro.map((line, i) => (
          <p key={i}>
            <GlossedText text={line} />
          </p>
        ))}
        <p className="fi-fictional">Deze gegevens zijn verzonnen, alleen om mee te oefenen.</p>
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
              ? 'Alle velden kloppen, ook de schrijfwijze van de datum, de postcode en het BSN.'
              : `${wrong.length} van de ${fields.length} velden klopt nog niet. Kijk naar het veld en de schrijfwijze.`
          }
        />
      )}

      <div className="g-actions">
        {!allOk && <Button onClick={check}>Controleer</Button>}
        {allOk && <Button onClick={advance}>Volgende formulier</Button>}
      </div>
    </Shell>
  )
}
