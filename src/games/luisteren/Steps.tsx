import type { Drill } from '../useDrill'
import './listening.css'

export interface StepDef<S extends string> {
  id: S
  /** English: "1. Words". */
  label: string
  /** What the progress bar counts on this step. */
  countLabel: string
}

/**
 * The step switcher of a Luisteren game that builds up from words to a whole
 * text: each tab shows how far its own drill is.
 */
export function Steps<S extends string>({
  steps,
  current,
  drills,
  onChoose,
}: {
  steps: StepDef<S>[]
  current: S
  drills: Record<S, Drill<{ id: string }>>
  onChoose: (step: S) => void
}) {
  return (
    <div className="g-chips" role="group" aria-label="Step">
      {steps.map((s) => (
        <button
          key={s.id}
          type="button"
          className={`g-chip ${current === s.id ? 'g-chip-selected' : ''}`}
          aria-pressed={current === s.id}
          onClick={() => onChoose(s.id)}
        >
          {s.label}{' '}
          <span className="ls-step-count">
            {drills[s.id].mastered}/{drills[s.id].total}
          </span>
        </button>
      ))}
    </div>
  )
}

/** The first step whose drill is not done yet, or the last step. */
export function firstOpenStep<S extends string>(steps: StepDef<S>[], drills: Record<S, Drill<{ id: string }>>): S {
  return (steps.find((s) => !drills[s.id].state.done) ?? steps[steps.length - 1]).id
}
