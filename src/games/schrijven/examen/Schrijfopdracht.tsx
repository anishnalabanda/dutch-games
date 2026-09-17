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

  // Level 1: zinnen afmaken.
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
          <Tag>Niveau 1 &middot; Zinnen afmaken</Tag>
          <span className="so-timer">
            {state.stemIds.length}/{stems.length}
          </span>
        </div>

        <p className="g-hint">
          Maak de zin zelf af. Geen tegels, geen keuzes, precies wat het examen van je vraagt.
        </p>

        <div className="g-worksheet so-stem">
          <GlossedText text={stem.stem} />{' '}
          <span className="so-stem-blank">{completion.trim() || '…'}</span>
        </div>

        <div>
          <label className="g-label" htmlFor="so-completion">
            Jouw vervolg
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
              <h4>Zo kan het ook</h4>
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
              Nakijken
            </Button>
          )}
          {stemChecked && (
            <>
              <Button variant="secondary" onClick={() => setStemChecked(false)}>
                Aanpassen
              </Button>
              <Button onClick={() => nextStem(stem.id)}>Volgende zin</Button>
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
            message={`Niveau 1 en niveau 2 zijn klaar: ${stems.length} zinnen afgemaakt en ${tasks.length} opdrachten geschreven en zelf nagekeken.`}
          />
          <p className="g-hint">{PAPER_NOTE}</p>
          <Button onClick={restart}>Opnieuw oefenen</Button>
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
        <Tag>Niveau 2 &middot; {task.register === 'formeel' ? 'Formeel' : 'Informeel'}</Tag>
        {mode && (
          <span className={`so-timer ${overTime ? 'so-timer-over' : ''}`}>
            {formatTime(seconds)} / {task.minutes}:00
          </span>
        )}
      </div>

      <div className="so-brief">
        <h3 className="so-title">{task.title}</h3>
        <p className="g-hint">
          Aan: <strong>{task.recipient}</strong>
        </p>
        <p className="so-situation">
          <GlossedText text={task.situation} />
        </p>
        <span className="g-label">Verwerk deze punten</span>
        <ul className="so-points">
          {task.points.map((point) => (
            <li key={point.label}>{point.label}</li>
          ))}
        </ul>
      </div>

      {mode === null && (
        <>
          <div className="so-paper-note">{PAPER_NOTE}</div>
          <div className="g-actions">
            <Button onClick={() => startMode('papier')}>Op papier schrijven</Button>
            <Button variant="secondary" onClick={() => startMode('typen')}>
              Typen (oefenvorm)
            </Button>
          </div>
        </>
      )}

      {mode === 'papier' && phase === 'schrijven' && (
        <>
          <div className="so-paper-note">
            Pak pen en papier en schrijf je bericht met de hand. De klok loopt. Klaar? Dan leg je je
            blad naast het modelantwoord.
          </div>
          <div className="g-actions">
            <Button onClick={finish}>Ik heb het opgeschreven</Button>
          </div>
        </>
      )}

      {mode === 'typen' && phase === 'schrijven' && (
        <>
          <div className="so-paper-note so-paper-note-warn">
            Let op: het echte examen schrijf je met de hand. Typen is hier alleen een oefening in
            het opbouwen van je tekst, geen examenrealistische oefening.
          </div>
          <label className="g-label" htmlFor="so-text">
            Jouw bericht
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
              Klaar: nakijken
            </Button>
          </div>
        </>
      )}

      {phase === 'nakijken' && (
        <>
          <div className="so-review">
            <div className="so-column">
              <span className="g-label">Automatische checks</span>
              {mode === 'typen' ? (
                <CheckList results={checks} />
              ) : (
                <p className="so-honesty">
                  Je hebt op papier geschreven, dus de app heeft je tekst niet gezien. Er valt hier
                  niets automatisch te controleren, het nakijken doe je hieronder zelf, met het
                  modelantwoord ernaast.
                </p>
              )}
              <p className="so-honesty">{HONESTY_NOTE}</p>
            </div>

            <div className="so-column">
              {mode === 'typen' && (
                <>
                  <span className="g-label">Jouw tekst</span>
                  <div className="g-worksheet so-text-copy">{text}</div>
                </>
              )}
              <span className="g-label">Modelantwoord</span>
              <div className="g-worksheet so-model">
                <GlossedText text={task.model} />
              </div>
            </div>
          </div>

          <div className="so-rubric">
            <span className="g-label">Zelf nakijken: de DUO-criteria</span>
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
              Terug
            </Button>
            <Button onClick={markDone} disabled={!ticked.every(Boolean)}>
              Opdracht afronden
            </Button>
          </div>
          {!ticked.every(Boolean) && (
            <p className="g-hint">
              Vink alleen aan wat je echt gecontroleerd hebt op je eigen blad.
            </p>
          )}
        </>
      )}
    </Shell>
  )
}
