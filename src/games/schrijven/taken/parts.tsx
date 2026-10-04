import { GlossedText } from '../../../components/GlossedText'
import { Tooltip } from '../../../components/Tooltip'
import type { Template } from './templates'
import type { Issue, Picture } from './types'

/** Numbered buttons for every task, so any one can be (re)opened. */
export function TaskPicker({
  items,
  finished,
  currentId,
  onSelect,
}: {
  items: { id: string }[]
  finished: Set<string>
  currentId: string
  onSelect: (id: string) => void
}) {
  return (
    <nav className="tk-picker" aria-label="Tasks">
      {items.map((item, i) => {
        const done = finished.has(item.id)
        const current = item.id === currentId
        return (
          <button
            key={item.id}
            type="button"
            className={`tk-pick ${done ? 'tk-pick-done' : ''} ${current ? 'tk-pick-current' : ''}`}
            aria-current={current ? 'true' : undefined}
            aria-label={`Task ${i + 1}${done ? ', done' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            {i + 1}
          </button>
        )
      })}
    </nav>
  )
}

/** The exam's photos, as emoji. The tooltip says what they show, in English. */
export function Pictures({ pictures }: { pictures: Picture[] }) {
  return (
    <div className="tk-pictures">
      {pictures.map((picture) => (
        <Tooltip key={picture.shows} content={picture.shows}>
          <span className="tk-picture" role="img" aria-label={picture.shows}>
            {picture.icons}
          </span>
        </Tooltip>
      ))}
    </div>
  )
}

/** The memorised frame for this task type, open beside the writing space and collapsible. */
export function TemplateCard({ template }: { template: Template }) {
  return (
    <details className="tk-template" open>
      <summary>{template.title}</summary>
      <ol>
        {template.lines.map((line) => (
          <li key={line.nl}>
            <span className="tk-template-nl">
              <GlossedText text={line.nl} />
            </span>
            <span className="tk-template-role">{line.role}</span>
          </li>
        ))}
      </ol>
      <p>{template.note}</p>
    </details>
  )
}

/** The task as the exam prints it: title, situation, pictures, bullets, instructions. */
export function Brief({
  title,
  situation,
  pictures,
  intro,
  bullets = [],
  instructions,
}: {
  title: string
  situation: string
  pictures?: Picture[]
  intro?: string
  bullets?: string[]
  instructions: string[]
}) {
  return (
    <section className="tk-brief">
      <h3 className="tk-title">
        <GlossedText text={title} />
      </h3>
      <p className="tk-line">
        <GlossedText text={situation} />
      </p>
      {pictures && <Pictures pictures={pictures} />}
      {intro && (
        <p className="tk-line">
          <GlossedText text={intro} />
        </p>
      )}
      {bullets.length > 0 && (
        <ul className="tk-bullets">
          {bullets.map((bullet) => (
            <li key={bullet}>
              <GlossedText text={bullet} />
            </li>
          ))}
        </ul>
      )}
      <div>
        {instructions.map((line) => (
          <p key={line} className="tk-line">
            <GlossedText text={line} />
          </p>
        ))}
      </div>
    </section>
  )
}

export interface ChecklistItem {
  id: string
  label: string
  /** Found by the pattern check. */
  found: boolean
  /** Whether the owner may tick it off by hand. Formats and choices cannot be. */
  coverable?: boolean
}

/**
 * What the examiner looks for. Statuses show once the owner has asked for a
 * hint or submitted; a point the checker cannot find can be ticked off by hand.
 */
export function Checklist({
  items,
  evaluated,
  covered,
  onCover,
}: {
  items: ChecklistItem[]
  evaluated: boolean
  covered: Set<string>
  onCover: (id: string, on: boolean) => void
}) {
  return (
    <section className="tk-checklist" aria-label="What the examiner looks for">
      <span className="g-label">What the examiner looks for</span>
      <ul>
        {items.map((item) => {
          const ticked = covered.has(item.id)
          const status = !evaluated ? 'open' : item.found || ticked ? 'ok' : 'missing'
          return (
            <li key={item.id} className={`tk-point tk-point-${status}`}>
              <span className="tk-point-mark" aria-hidden="true">
                {status === 'ok' ? '✓' : status === 'missing' ? '✕' : '○'}
              </span>
              <span className="tk-point-label">{item.label}</span>
              {evaluated && !item.found && item.coverable !== false && (
                <label className="tk-cover">
                  <input
                    type="checkbox"
                    checked={ticked}
                    onChange={(e) => onCover(item.id, e.target.checked)}
                  />
                  I covered this
                </label>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/** The extra help an issue has beyond its explanation, in the order hints reveal it. */
function steps(issue: Issue): { label: string; text: string }[] {
  return [
    issue.starter ? { label: 'Start like this', text: issue.starter } : null,
    issue.example ? { label: 'For example', text: issue.example } : null,
  ].filter((step): step is { label: string; text: string } => step !== null)
}

export function maxLevel(issue: Issue): number {
  return 1 + steps(issue).length
}

/** One hint: the explanation first, then a Dutch starter, then a whole example. */
export function HintCard({ issue, level }: { issue: Issue; level: number }) {
  const shown = steps(issue).slice(0, level - 1)
  return (
    <div className={`tk-hint ${issue.blocking ? '' : 'tk-hint-advice'}`} role="status">
      <strong>{issue.title}</strong>
      <p>{issue.explain}</p>
      {shown.map((step) => (
        <div key={step.label} className="tk-hint-dutch">
          <span className="g-label">{step.label}</span>
          <GlossedText text={step.text} />
        </div>
      ))}
      {level < maxLevel(issue) && <p className="tk-hint-more">Press Hint again for more help with this.</p>}
    </div>
  )
}

/** What still has to happen before Submit counts the task as done. */
export function NotFinished({ issues }: { issues: Issue[] }) {
  if (issues.length === 0) {
    return (
      <div className="feedback-box feedback-ok" role="status">
        <strong>All fixed</strong>
        <p>Everything that was missing is there now. Press Submit again.</p>
      </div>
    )
  }
  return (
    <div className="tk-not-finished" role="status">
      <div className="feedback-box feedback-alert">
        <strong>Not finished yet</strong>
        <p>
          {issues.length} {issues.length === 1 ? 'thing' : 'things'} to do before this counts as done.
          Press Hint for help, one step at a time.
        </p>
      </div>
      <ul className="tk-issues">
        {issues.map((issue) => (
          <li key={issue.id}>
            <strong>{issue.title}</strong>
            <p>{issue.explain}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Advice that did not block the task: shown with the result, never as a failure. */
export function Advice({ issues }: { issues: Issue[] }) {
  if (issues.length === 0) return null
  return (
    <section className="tk-advice">
      <span className="g-label">Worth another look</span>
      <ul className="tk-issues">
        {issues.map((issue) => (
          <li key={issue.id}>
            <strong>{issue.title}</strong>
            <p>{issue.explain}</p>
            {issue.example && (
              <p className="tk-advice-example">
                <GlossedText text={issue.example} />
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

/** The hint shown when nothing is left to fix. */
export const ALL_GOOD: Issue = {
  id: 'klaar',
  blocking: false,
  title: 'Everything is there',
  explain: 'Every point is covered and the sentences look complete. Press Submit.',
}

/**
 * Picks the hint for a press of the Hint button: the first issue, one level
 * deeper than last time if it is the same issue again.
 */
export function nextHint(
  issues: Issue[],
  levels: Record<string, number>,
): { issue: Issue; level: number } {
  const issue = issues[0] ?? ALL_GOOD
  const level = Math.min((levels[issue.id] ?? 0) + 1, maxLevel(issue))
  return { issue, level }
}
