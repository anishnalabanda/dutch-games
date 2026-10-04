import { useEffect, useState, type KeyboardEvent } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { Tag } from '../../../components/Tag'
import { Tooltip } from '../../../components/Tooltip'
import { HONESTY_NOTE } from '../taken/checks'
import { Advice, Brief, Checklist, HintCard, NotFinished, TaskPicker, TemplateCard, nextHint } from '../taken/parts'
import { FORM_TEMPLATE } from '../taken/templates'
import { useTasks } from '../taken/useTasks'
import type { Issue } from '../taken/types'
import { answered, formIssues } from './checks'
import { forms, type Choice, type OpenQuestion } from './data'
import { fieldValid } from './fields'
import '../taken/taken.css'
import './FormulierInvullen.css'

const STORE_KEY = 'nl.schrijven.formulieren'
const TITLE = 'Formulier invullen'

type Phase = 'write' | 'blocked' | 'done'

/**
 * Forms as the exam sets them. The owner fills in their own (or made-up)
 * details, checked for format only and never saved, ticks a choice, and
 * answers the open questions in whole sentences. Hint walks the form top to
 * bottom; Submit finishes it once nothing is missing.
 */
export function FormulierInvullen() {
  const game = useTasks(STORE_KEY, forms, { keepDrafts: false })
  const [values, setValues] = useState<Record<string, string>>({})
  const [phase, setPhase] = useState<Phase>('write')
  const [evaluated, setEvaluated] = useState(false)
  const [covered, setCovered] = useState<Set<string>>(new Set())
  const [levels, setLevels] = useState<Record<string, number>>({})
  const [hint, setHint] = useState<{ issue: Issue; level: number } | null>(null)
  const [today] = useState(() => new Date())

  const form = game.current
  const formId = form?.id

  // A blank form for every task opened. Nothing typed here is kept.
  useEffect(() => {
    setValues({})
    setPhase('write')
    setEvaluated(false)
    setCovered(new Set())
    setLevels({})
    setHint(null)
  }, [formId])

  if (!game.loaded || !form) return null

  const issues = formIssues({ form, values, covered, today })
  const blocking = issues.filter((issue) => issue.blocking)
  const advice = issues.filter((issue) => !issue.blocking)
  const isDone = game.finished.has(form.id)
  const target = phase === 'blocked' ? null : hint?.issue.target
  const allDone = game.finished.size === game.total
  const nextForm = game.nextUnfinished ?? forms[(game.index + 1) % forms.length]

  function update(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }))
    if (phase === 'done') setPhase('write')
  }

  function askHint() {
    const next = nextHint(issues, levels)
    setLevels((prev) => ({ ...prev, [next.issue.id]: next.level }))
    setHint(next)
    setEvaluated(true)
  }

  function submit() {
    setEvaluated(true)
    setHint(null)
    if (blocking.length > 0) {
      setPhase('blocked')
      return
    }
    game.finish()
    setPhase('done')
  }

  function cover(id: string, on: boolean) {
    setCovered((prev) => {
      const next = new Set(prev)
      if (on) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const checklist = form.sections.map((section) => {
    if (section.kind === 'fields') {
      return {
        id: `fields-${section.heading}`,
        label: `${section.heading}: every field filled in, in the right format`,
        found: section.fields.every((field) => fieldValid(field.kind, values[field.id] ?? '', today)),
        coverable: false,
      }
    }
    if (section.kind === 'choice') {
      return {
        id: section.choice.id,
        label: 'One option ticked',
        found: (values[section.choice.id] ?? '') !== '',
        coverable: false,
      }
    }
    const q = section.question
    return { id: q.id, label: `Answered: ${q.question}`, found: answered(q, values[q.id] ?? '') }
  })

  return (
    <Shell title={TITLE} backTo="/schrijven" progress={{ value: game.finished.size, max: game.total }} countLabel="done">
      {allDone && (
        <p className="tk-all-done">
          All {game.total} done. Open any form to fill it in again: practice is never wasted.
        </p>
      )}
      <TaskPicker items={forms} finished={game.finished} currentId={form.id} onSelect={game.select} />

      <div className="g-row">
        <Tag>
          Form {game.index + 1} of {game.total}
        </Tag>
        <span className="tk-tags">
          {form.exam && <Tag>Like practice exam {form.exam}</Tag>}
          {isDone && <Tag tone="ok">Done</Tag>}
        </span>
      </div>

      <Brief title={form.title} situation={form.situation} pictures={form.pictures} instructions={form.instructions} />

      <p className="g-hint">
        Fill in your own details, or made-up ones: nothing you type on this form is saved or sent.
      </p>

      <TemplateCard template={FORM_TEMPLATE} />

      <div className="fo-sheet">
        <h3 className="fo-title">
          <GlossedText text={form.formTitle} />
        </h3>
        {form.sections.map((section) => {
          if (section.kind === 'fields') {
            return (
              <section key={section.heading} className="fo-section">
                <h4 className="fo-heading">
                  <GlossedText text={section.heading} />
                </h4>
                {section.fields.map((field) => (
                  <div key={field.id} className={`fo-row ${target === field.id ? 'fo-target' : ''}`}>
                    <label className="fo-label" htmlFor={`fo-${field.id}`}>
                      <Tooltip content={field.gloss}>
                        <span className="fo-label-name">{field.label}</span>
                      </Tooltip>
                    </label>
                    <input
                      id={`fo-${field.id}`}
                      className="fo-input"
                      value={values[field.id] ?? ''}
                      autoComplete="off"
                      spellCheck={false}
                      onChange={(e) => update(field.id, e.target.value)}
                    />
                  </div>
                ))}
              </section>
            )
          }
          if (section.kind === 'choice') {
            return (
              <ChoiceSection
                key={section.choice.id}
                choice={section.choice}
                value={values[section.choice.id] ?? ''}
                highlighted={target === section.choice.id}
                onChoose={(option) => update(section.choice.id, option)}
              />
            )
          }
          return (
            <QuestionSection
              key={section.question.id}
              question={section.question}
              value={values[section.question.id] ?? ''}
              highlighted={target === section.question.id}
              showExample={phase === 'done'}
              onChange={(value) => update(section.question.id, value)}
            />
          )
        })}
      </div>

      {phase !== 'done' && (
        <>
          <Checklist items={checklist} evaluated={evaluated} covered={covered} onCover={cover} />
          {hint && <HintCard issue={hint.issue} level={hint.level} />}
          {phase === 'blocked' && <NotFinished issues={blocking} />}
          <div className="g-actions">
            <Button variant="secondary" onClick={askHint}>
              Hint
            </Button>
            <Button onClick={submit}>Submit</Button>
          </div>
          <p className="tk-honesty">{HONESTY_NOTE}</p>
        </>
      )}

      {phase === 'done' && (
        <>
          <div className="feedback-box feedback-ok" role="status">
            <strong>Done</strong>
            <p>
              Every field is in the right format and every question has a whole-sentence answer. Under
              each question is one way to answer it, not the only one.
            </p>
          </div>
          <Advice issues={advice} />
          <div className="g-actions">
            <Button onClick={() => game.select(nextForm.id)}>Next form</Button>
          </div>
        </>
      )}
    </Shell>
  )
}

/** A choice made of Dutch text: radios that can hold glossed words (AGENTS.md section 7). */
function ChoiceSection({
  choice,
  value,
  highlighted,
  onChoose,
}: {
  choice: Choice
  value: string
  highlighted: boolean
  onChoose: (option: string) => void
}) {
  function onKey(e: KeyboardEvent, option: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onChoose(option)
    }
  }
  return (
    <section className={`fo-section ${highlighted ? 'fo-target' : ''}`}>
      <h4 className="fo-heading" id={`fo-${choice.id}`}>
        <GlossedText text={choice.heading} />
      </h4>
      <div className="fo-options" role="radiogroup" aria-labelledby={`fo-${choice.id}`}>
        {choice.options.map((option) => {
          const selected = value === option
          return (
            <div
              key={option}
              role="radio"
              aria-checked={selected}
              tabIndex={0}
              className={`fo-option ${selected ? 'fo-option-selected' : ''}`}
              onClick={() => onChoose(option)}
              onKeyDown={(e) => onKey(e, option)}
            >
              <span className="fo-radio" aria-hidden="true" />
              <GlossedText text={option} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

function QuestionSection({
  question,
  value,
  highlighted,
  showExample,
  onChange,
}: {
  question: OpenQuestion
  value: string
  highlighted: boolean
  showExample: boolean
  onChange: (value: string) => void
}) {
  return (
    <section className={`fo-section ${highlighted ? 'fo-target' : ''}`}>
      {/* Not a <label>: a click on a glossed word would move focus to the box. */}
      <h4 className="fo-heading" id={`fo-q-${question.id}`}>
        <GlossedText text={question.question} />
      </h4>
      <textarea
        aria-labelledby={`fo-q-${question.id}`}
        className="fo-answer"
        rows={3}
        value={value}
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
      />
      {showExample && (
        <p className="fo-example">
          <span className="g-label">One way to answer</span>
          <GlossedText text={question.example} />
        </p>
      )}
    </section>
  )
}
