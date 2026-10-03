import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { Tag } from '../../../components/Tag'
import { Tooltip } from '../../../components/Tooltip'
import { useDrill } from '../../useDrill'
import type { CheckResult } from '../examen/checks'
import { ANSWER_NOTE, answerPasses, checkAnswer } from './checks'
import { fieldValid, FORMAT_HELP, forms, type DutchForm } from './data'
import './FormulierInvullen.css'

const STORE_KEY = 'nl.schrijven.formulier'

const STATUS_MARK: Record<CheckResult['status'], string> = { ok: '✓', warn: '!', fail: '✕' }

function emptyValues(form: DutchForm | null): Record<string, string> {
  if (!form) return {}
  return Object.fromEntries([...form.fields, ...form.questions].map((entry) => [entry.id, '']))
}

export function FormulierInvullen() {
  const drill = useDrill(STORE_KEY, forms)
  const [values, setValues] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const [today] = useState(() => new Date())

  const current = drill.current
  const currentId = current?.id

  // Clear the form for each new presentation, including a repeat of a missed one.
  // Nothing typed here is saved: these are the owner's own details.
  useEffect(() => {
    setValues(emptyValues(current))
    setChecked(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, drill.round])

  if (!drill.loaded) return null

  if (!current) {
    return (
      <Shell title="Formulier invullen" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Done. You filled in all ${forms.length} forms right first time.`}
          />
          <Button onClick={drill.restart}>Practise again</Button>
        </div>
      </Shell>
    )
  }

  const fieldOk = Object.fromEntries(
    current.fields.map((field) => [field.id, fieldValid(field.kind, values[field.id] ?? '', today)]),
  )
  const answerChecks = Object.fromEntries(
    current.questions.map((q) => [q.id, checkAnswer(q, values[q.id] ?? '')]),
  )
  const badFields = current.fields.filter((field) => !fieldOk[field.id]).length
  const badAnswers = current.questions.filter((q) => !answerPasses(answerChecks[q.id])).length
  const allOk = checked && badFields === 0 && badAnswers === 0
  const blank = [...current.fields, ...current.questions].some(
    (entry) => (values[entry.id] ?? '').trim() === '',
  )

  function check() {
    if (blank) return
    setChecked(true)
    if (badFields > 0 || badAnswers > 0) drill.miss()
    else drill.hit()
  }

  function update(id: string, value: string) {
    setValues((v) => ({ ...v, [id]: value }))
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

      <div className="fi-brief">
        <p className="fi-situation">
          <GlossedText text={current.situation} />
        </p>
        <p className="g-hint">
          Fill in your own details, or made-up ones: nothing you type here is saved or sent. Then
          answer the questions in whole sentences, as you would by hand on the exam.
        </p>
      </div>

      <div className="fi-sheet">
        <h3 className="fi-title">
          <GlossedText text={current.title} />
        </h3>

        <div className="fi-form">
          {current.fields.map((field) => {
            const status = checked ? (fieldOk[field.id] ? 'fi-field-ok' : 'fi-field-alert') : ''
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
                  disabled={checked}
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(e) => update(field.id, e.target.value)}
                />
                {checked && !fieldOk[field.id] && (
                  <p className="fi-field-help">{FORMAT_HELP[field.kind]}</p>
                )}
              </div>
            )
          })}
        </div>

        <div className="fi-questions">
          {current.questions.map((q) => {
            const results = answerChecks[q.id]
            const passes = answerPasses(results)
            const status = checked ? (passes ? 'fi-field-ok' : 'fi-field-alert') : ''
            const notes = results.filter((r) => r.status !== 'ok')
            return (
              <div key={q.id} className={`fi-field fi-question ${status}`}>
                {/* Not a <label>: a click on a glossed word would move focus to the box. */}
                <p className="fi-question-text" id={`fi-q-${q.id}`}>
                  <GlossedText text={q.question} />
                </p>
                <textarea
                  aria-labelledby={`fi-q-${q.id}`}
                  className="fi-field-input fi-answer"
                  rows={2}
                  value={values[q.id] ?? ''}
                  disabled={checked}
                  spellCheck={false}
                  onChange={(e) => update(q.id, e.target.value)}
                />
                {checked && (
                  <>
                    {notes.length === 0 ? (
                      <p className="fi-note fi-note-ok">
                        <span aria-hidden="true">{STATUS_MARK.ok}</span> Every check passes.
                      </p>
                    ) : (
                      <ul className="fi-notes">
                        {notes.map((r) => (
                          <li key={r.id} className={`fi-note fi-note-${r.status}`}>
                            <span aria-hidden="true">{STATUS_MARK[r.status]}</span>{' '}
                            <strong>{r.label}:</strong> {r.detail}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="g-worksheet fi-model">
                      <span className="fi-model-label">Model answer</span>
                      <GlossedText text={q.model} />
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {checked && (
        <>
          <FeedbackBox
            correct={allOk}
            message={
              allOk
                ? 'Every field has the right format and every answer is a whole, formal sentence that fits its question.'
                : [
                    badFields > 0 &&
                      `${badFields} ${badFields === 1 ? 'field does' : 'fields do'} not have the right format yet.`,
                    badAnswers > 0 &&
                      `${badAnswers} ${badAnswers === 1 ? 'answer needs' : 'answers need'} another look.`,
                  ]
                    .filter(Boolean)
                    .join(' ')
            }
          />
          <p className="fi-honesty">{ANSWER_NOTE}</p>
        </>
      )}

      <div className="g-actions">
        {!checked && (
          <Button onClick={check} disabled={blank}>
            Check
          </Button>
        )}
        {checked && !allOk && <Button onClick={() => setChecked(false)}>Adjust</Button>}
        {allOk && <Button onClick={drill.advance}>Next form</Button>}
      </div>
    </Shell>
  )
}
