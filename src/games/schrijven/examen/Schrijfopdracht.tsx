import { useEffect, useRef, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { Tag } from '../../../components/Tag'
import { useGameProgress } from '../../useGameProgress'
import { checkCompletion, HONESTY_NOTE, PAPER_NOTE, runChecks, type CheckResult } from './checks'
import { RUBRIC, stems, tasks, type SentenceStem, type WritingTask } from './data'
import './Schrijfopdracht.css'

const STORE_KEY = 'nl.schrijven.examen'

interface ExamenState {
  done: boolean
  /** Level 1: completed sentence stems. */
  stemIds: string[]
  /** Level 2: completed writing tasks. */
  completedIds: string[]
  drafts: Record<string, string>
}

const initialState: ExamenState = { done: false, stemIds: [], completedIds: [], drafts: {} }

const STATUS_TONE: Record<CheckResult['status'], string> = {
  ok: 'so-check-ok',
  warn: 'so-check-warn',
  fail: 'so-check-fail',
}
const STATUS_MARK: Record<CheckResult['status'], string> = { ok: '✓', warn: '!', fail: '✕' }

function CheckList({ results }: { results: CheckResult[] }) {
  return (
    <ul className="so-checks">
      {results.map((check) => (
        <li key={check.id} className={`so-check ${STATUS_TONE[check.status]}`}>
          <span className="so-check-mark" aria-hidden="true">
            {STATUS_MARK[check.status]}
          </span>
          <div>
            <strong>{check.label}</strong>
            <p>{check.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

function formatTime(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
}

export function Schrijfopdracht() {
  const { state, loaded, save } = useGameProgress<ExamenState>(STORE_KEY, initialState)

  // Level 1: finishing sentences.
  const [stem, setStem] = useState<SentenceStem | null>(null)
  const [completion, setCompletion] = useState('')
  const [stemChecked, setStemChecked] = useState(false)

  // Level 2: the full task.
  const [task, setTask] = useState<WritingTask | null>(null)
  const [mode, setMode] = useState<'papier' | 'typen' | null>(null)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<'schrijven' | 'nakijken'>('schrijven')
  const [seconds, setSeconds] = useState(0)
  const [ticked, setTicked] = useState<boolean[]>(RUBRIC.map(() => false))
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (!loaded) return
    setStem(stems.find((s) => !state.stemIds.includes(s.id)) ?? null)
    setTask(tasks.find((t) => !state.completedIds.includes(t.id)) ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  useEffect(() => {
    if (mode === null || phase !== 'schrijven') return
    timer.current = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => {
      if (timer.current !== null) window.clearInterval(timer.current)
    }
  }, [mode, phase, task])

  if (!loaded) return null

  // ---- Level 1 ----------------------------------------------------------

  function nextStem(doneId: string) {
    const stemIds = state.stemIds.includes(doneId) ? state.stemIds : [...state.stemIds, doneId]
    save({ ...state, stemIds })
    setStem(stems.find((s) => !stemIds.includes(s.id)) ?? null)
    setCompletion('')
    setStemChecked(false)
  }

  if (stem) {
    const results = stemChecked ? checkCompletion(stem.rule, completion) : []
    return (
      <Shell
        title="Schrijfopdracht"
        backTo="/schrijven"
        progress={{ value: state.stemIds.length, max: stems.length }}
      >
        <div className="g-row">
          <Tag>Level 1 &middot; Finish the sentence</Tag>
          <span className="so-timer">
            {state.stemIds.length}/{stems.length}
          </span>
        </div>

        <p className="g-hint">
          Finish the sentence yourself. No tiles, no multiple choice: exactly what the exam asks
          of you.
        </p>

        <div className="g-worksheet so-stem">
          <GlossedText text={stem.stem} />{' '}
          <span className="so-stem-blank">{completion.trim() || '…'}</span>
        </div>

        <div>
          <label className="g-label" htmlFor="so-completion">
            Your continuation
          </label>
          <input
            id="so-completion"
            className="g-input so-completion"
            value={completion}
            disabled={stemChecked}
            autoComplete="off"
            spellCheck={false}
            placeholder="… ik die dag moet werken."
            onChange={(e) => setCompletion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && completion.trim() !== '') setStemChecked(true)
            }}
          />
        </div>

        {stemChecked && (
          <>
            <CheckList results={results} />
            <div className="g-worksheet so-model">
              <h4>Other ways to say it</h4>
              {stem.models.map((model) => (
                <p key={model}>
                  {stem.stem} <GlossedText text={model} />
                </p>
              ))}
            </div>
            <p className="g-hint">{stem.hint}</p>
          </>
        )}

        <div className="g-actions">
          {!stemChecked && (
            <Button onClick={() => setStemChecked(true)} disabled={completion.trim() === ''}>
              Check
            </Button>
          )}
          {stemChecked && (
            <>
              <Button variant="secondary" onClick={() => setStemChecked(false)}>
                Adjust
              </Button>
              <Button onClick={() => nextStem(stem.id)}>Next sentence</Button>
            </>
          )}
        </div>
      </Shell>
    )
  }

  // ---- Level 2 ----------------------------------------------------------

  function startMode(choice: 'papier' | 'typen') {
    setMode(choice)
    setPhase('schrijven')
    setSeconds(0)
    setText(task ? (state.drafts[task.id] ?? '') : '')
  }

  function finish() {
    if (!task) return
    if (mode === 'typen') save({ ...state, drafts: { ...state.drafts, [task.id]: text } })
    setPhase('nakijken')
  }

  function markDone() {
    if (!task || !ticked.every(Boolean)) return
    const completedIds = state.completedIds.includes(task.id)
      ? state.completedIds
      : [...state.completedIds, task.id]
    save({
      ...state,
      completedIds,
      drafts: mode === 'typen' ? { ...state.drafts, [task.id]: text } : state.drafts,
      done: completedIds.length === tasks.length && state.stemIds.length === stems.length,
    })
    setTask(tasks.find((t) => !completedIds.includes(t.id)) ?? null)
    setMode(null)
    setPhase('schrijven')
    setSeconds(0)
    setTicked(RUBRIC.map(() => false))
    setText('')
  }

  function restart() {
    save({ ...initialState, drafts: state.drafts })
    setStem(stems[0])
    setTask(tasks[0])
    setMode(null)
    setPhase('schrijven')
    setSeconds(0)
    setTicked(RUBRIC.map(() => false))
  }

  if (!task) {
    return (
      <Shell title="Schrijfopdracht" backTo="/schrijven">
        <div className="g-done">
          <FeedbackBox
            correct
            message={`Level 1 and level 2 are done: ${stems.length} sentences finished, and ${tasks.length} tasks written and marked by you.`}
          />
          <p className="g-hint">{PAPER_NOTE}</p>
          <Button onClick={restart}>Practise again</Button>
        </div>
      </Shell>
    )
  }

  const overTime = seconds > task.minutes * 60
  const checks = phase === 'nakijken' && mode === 'typen' ? runChecks(task, text) : []

  return (
    <Shell
      title="Schrijfopdracht"
      backTo="/schrijven"
      progress={{ value: state.completedIds.length, max: tasks.length }}
    >
      <div className="g-row">
        <Tag>Level 2 &middot; {task.register === 'formeel' ? 'Formal' : 'Informal'}</Tag>
        {mode && (
          <span className={`so-timer ${overTime ? 'so-timer-over' : ''}`}>
            {formatTime(seconds)} / {task.minutes}:00
          </span>
        )}
      </div>

      <div className="so-brief">
        <h3 className="so-title">{task.title}</h3>
        <p className="g-hint">
          To: <strong>{task.recipient}</strong>
        </p>
        <p className="so-situation">
          <GlossedText text={task.situation} />
        </p>
        <span className="g-label">Cover these points</span>
        <ul className="so-points">
          {task.points.map((point) => (
            <li key={point.label}>
              <GlossedText text={point.label} />
            </li>
          ))}
        </ul>
      </div>

      {mode === null && (
        <>
          <div className="so-paper-note">{PAPER_NOTE}</div>
          <div className="g-actions">
            <Button onClick={() => startMode('papier')}>Write it on paper</Button>
            <Button variant="secondary" onClick={() => startMode('typen')}>
              Type it (practice only)
            </Button>
          </div>
        </>
      )}

      {mode === 'papier' && phase === 'schrijven' && (
        <>
          <div className="so-paper-note">
            Take pen and paper and write your message by hand. The clock is running. Done? Then
            put your sheet next to the model answer.
          </div>
          <div className="g-actions">
            <Button onClick={finish}>I have written it</Button>
          </div>
        </>
      )}

      {mode === 'typen' && phase === 'schrijven' && (
        <>
          <div className="so-paper-note so-paper-note-warn">
            Careful: the real exam is handwritten. Typing here only practises how you build your
          text, so it is not exam-realistic.
          </div>
          <label className="g-label" htmlFor="so-text">
            Your message
          </label>
          <textarea
            id="so-text"
            className="so-textarea"
            value={text}
            rows={14}
            spellCheck={false}
            placeholder={'Geachte heer/mevrouw,\n\n...'}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="g-actions">
            <Button onClick={finish} disabled={text.trim() === ''}>
              Done: check it
            </Button>
          </div>
        </>
      )}

      {phase === 'nakijken' && (
        <>
          <div className="so-review">
            <div className="so-column">
              <span className="g-label">Automatic checks</span>
              {mode === 'typen' ? (
                <CheckList results={checks} />
              ) : (
                <p className="so-honesty">
                  You wrote on paper, so the app has not seen your text. There is nothing to check
                  automatically here: you do the marking yourself below, with the model answer next
                  to it.
                </p>
              )}
              <p className="so-honesty">{HONESTY_NOTE}</p>
            </div>

            <div className="so-column">
              {mode === 'typen' && (
                <>
                  <span className="g-label">Your text</span>
                  <div className="g-worksheet so-text-copy">{text}</div>
                </>
              )}
              <span className="g-label">Model answer</span>
              <div className="g-worksheet so-model">
                <GlossedText text={task.model} />
              </div>
            </div>
          </div>

          <div className="so-rubric">
            <span className="g-label">Mark it yourself: the DUO criteria</span>
            {RUBRIC.map((line, i) => (
              <label key={line} className="so-rubric-row">
                <input
                  type="checkbox"
                  checked={ticked[i]}
                  onChange={(e) =>
                    setTicked((prev) => prev.map((v, j) => (j === i ? e.target.checked : v)))
                  }
                />
                <span>{line}</span>
              </label>
            ))}
          </div>

          <div className="g-actions">
            <Button variant="secondary" onClick={() => setPhase('schrijven')}>
              Back
            </Button>
            <Button onClick={markDone} disabled={!ticked.every(Boolean)}>
              Finish this task
            </Button>
          </div>
          {!ticked.every(Boolean) && (
            <p className="g-hint">
              Only tick what you have really checked on your own sheet.
            </p>
          )}
        </>
      )}
    </Shell>
  )
}
