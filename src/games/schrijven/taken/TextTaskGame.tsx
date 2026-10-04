import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { GlossedText } from '../../../components/GlossedText'
import { Tag } from '../../../components/Tag'
import { HONESTY_NOTE, PAPER_NOTE, hasKeyword, textIssues } from './checks'
import { Advice, Brief, Checklist, HintCard, NotFinished, TaskPicker, TemplateCard, nextHint } from './parts'
import type { Template } from './templates'
import { useTasks } from './useTasks'
import type { Issue, TextTask } from './types'
import './taken.css'

interface TextTaskGameProps {
  storeKey: string
  /** Dutch, as in the manifest. */
  title: string
  /** English: what one task is called, for the labels ("e-mail", "message", "text"). */
  noun: string
  tasks: TextTask[]
  /** The memorised frame for this task type. */
  template: Template
}

type Phase = 'write' | 'blocked' | 'done'

/**
 * One exam writing task at a time, laid out like the exam page: the brief,
 * then the e-mail window, note or newspaper box with the greeting and closing
 * already printed. Hint reads the text so far and gives the next step;
 * Submit finishes the task once every point is covered.
 */
export function TextTaskGame({ storeKey, title, noun, tasks, template }: TextTaskGameProps) {
  const game = useTasks(storeKey, tasks)
  const [phase, setPhase] = useState<Phase>('write')
  const [evaluated, setEvaluated] = useState(false)
  const [covered, setCovered] = useState<Set<string>>(new Set())
  const [levels, setLevels] = useState<Record<string, number>>({})
  const [hint, setHint] = useState<{ issue: Issue; level: number } | null>(null)

  const task = game.current
  const taskId = task?.id

  // A fresh start for every task opened, including one opened again.
  useEffect(() => {
    setPhase('write')
    setEvaluated(false)
    setCovered(new Set())
    setLevels({})
    setHint(null)
  }, [taskId])

  if (!game.loaded || !task) return null

  const body = game.draft.body ?? ''
  const name = game.draft.name ?? ''
  const issues = textIssues({ task, body, name, covered })
  const blocking = issues.filter((issue) => issue.blocking)
  const advice = issues.filter((issue) => !issue.blocking)
  const isDone = game.finished.has(task.id)

  function edit(field: 'body' | 'name', value: string) {
    game.setDraft({ body, name, [field]: value })
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

  const allDone = game.finished.size === game.total
  const nextTask = game.nextUnfinished ?? tasks[(game.index + 1) % tasks.length]

  return (
    <Shell
      title={title}
      backTo="/schrijven"
      progress={{ value: game.finished.size, max: game.total }}
      countLabel="done"
    >
      {allDone && (
        <p className="tk-all-done">
          All {game.total} done. Open any task to write it again: practice is never wasted.
        </p>
      )}
      <TaskPicker items={tasks} finished={game.finished} currentId={task.id} onSelect={game.select} />

      <div className="g-row">
        <Tag>
          {noun} {game.index + 1} of {game.total}
        </Tag>
        <span className="tk-tags">
          {task.exam && <Tag>Like practice exam {task.exam}</Tag>}
          {isDone && <Tag tone="ok">Done</Tag>}
        </span>
      </div>

      <Brief
        title={task.title}
        situation={task.situation}
        pictures={task.pictures}
        intro={task.intro}
        bullets={task.bullets}
        instructions={task.instructions}
      />

      <TemplateCard template={template} />

      <WritingFrame task={task} body={body} name={name} noun={noun} onEdit={edit} />

      {phase !== 'done' && (
        <>
          <Checklist
            items={task.points.map((point) => ({
              id: point.id,
              label: point.label,
              found: hasKeyword(body, point.keywords),
            }))}
            evaluated={evaluated}
            covered={covered}
            onCover={cover}
          />
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
              Every point is covered. Compare your {noun} with the one below: it is one way to write
              it, not the only one.
            </p>
          </div>
          <Advice issues={advice} />
          <section>
            <span className="g-label">One way to write it</span>
            <ModelAnswer task={task} />
          </section>
          <p className="tk-honesty">{PAPER_NOTE}</p>
          <div className="g-actions">
            <Button onClick={() => game.select(nextTask.id)}>Next {noun}</Button>
          </div>
        </>
      )}
    </Shell>
  )
}

/** The space to write in, framed the way the exam prints it. */
function WritingFrame({
  task,
  body,
  name,
  noun,
  onEdit,
}: {
  task: TextTask
  body: string
  name: string
  noun: string
  onEdit: (field: 'body' | 'name', value: string) => void
}) {
  const textarea = (
    <textarea
      className="tk-write"
      aria-label={`Your ${noun}`}
      value={body}
      rows={task.frame.kind === 'krant' ? 9 : 8}
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      onChange={(e) => onEdit('body', e.target.value)}
    />
  )
  const signature = (
    <input
      className="tk-name"
      aria-label="Your name"
      placeholder="Your name"
      value={name}
      spellCheck={false}
      autoComplete="off"
      onChange={(e) => onEdit('name', e.target.value)}
    />
  )
  const frame = task.frame

  if (frame.kind === 'mail') {
    return (
      <div className="tk-mail">
        <div className="tk-mail-bar">
          <GlossedText text={frame.subject} />
        </div>
        <dl className="tk-mail-head">
          <div>
            <dt>
              <GlossedText text="Van" />
            </dt>
            <dd>kandidaat@mail.nl</dd>
          </div>
          <div>
            <dt>
              <GlossedText text="Aan" />
            </dt>
            <dd>{frame.to}</dd>
          </div>
          <div>
            <dt>
              <GlossedText text="Onderwerp" />
            </dt>
            <dd>
              <GlossedText text={frame.subject} />
            </dd>
          </div>
        </dl>
        <div className="tk-paper">
          <p className="tk-printed">
            <GlossedText text={frame.greeting} />
          </p>
          {textarea}
          <p className="tk-printed">
            <GlossedText text={frame.closing} />
          </p>
          {signature}
        </div>
      </div>
    )
  }

  if (frame.kind === 'note') {
    return (
      <div className="tk-paper tk-note">
        <p className="tk-printed">
          <GlossedText text={frame.greeting} />
        </p>
        {textarea}
        {frame.closing.map((line) => (
          <p key={line} className="tk-printed">
            <GlossedText text={line} />
          </p>
        ))}
        {signature}
      </div>
    )
  }

  return (
    <div className="tk-krant">
      <p className="tk-krant-lead">
        <GlossedText text={frame.lead} />
      </p>
      <div className="tk-paper tk-box">{textarea}</div>
    </div>
  )
}

/** The model body, with the printed greeting and closing around it. */
function ModelAnswer({ task }: { task: TextTask }) {
  const frame = task.frame
  return (
    <div className="g-worksheet tk-model">
      {frame.kind !== 'krant' && (
        <p>
          <GlossedText text={frame.greeting} />
        </p>
      )}
      <p>
        <GlossedText text={task.model} />
      </p>
      {frame.kind === 'mail' && (
        <p>
          <GlossedText text={frame.closing} />
          <br />
          Anish
        </p>
      )}
      {frame.kind === 'note' && (
        <p>
          {frame.closing.map((line) => (
            <span key={line}>
              <GlossedText text={line} />
              <br />
            </span>
          ))}
          Anish
        </p>
      )}
    </div>
  )
}
