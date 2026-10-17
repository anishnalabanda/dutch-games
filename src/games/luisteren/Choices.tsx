import { GlossedText } from '../../components/GlossedText'
import './listening.css'

function radioKeys(e: React.KeyboardEvent, action: () => void) {
  if (e.key !== 'Enter' && e.key !== ' ') return
  e.preventDefault()
  action()
}

/**
 * A row of Dutch answer chips. They hold `GlossedText`, so they are radios, not
 * buttons. `answer` is set once the choice is checked: it marks right and wrong
 * and locks the row.
 */
export function Choices<T extends string>({
  options,
  label,
  picked,
  answer,
  onPick,
  text,
  arrow,
  className,
}: {
  options: readonly T[]
  label: string
  picked: T | null
  answer: T | null
  onPick: (option: T) => void
  text: (option: T) => string
  arrow?: (option: T) => string
  className: string
}) {
  const locked = answer !== null
  return (
    <div className={className} role="radiogroup" aria-label={label}>
      {options.map((option) => {
        const selected = picked === option
        const mark = locked ? (option === answer ? 'g-chip-ok' : selected ? 'g-chip-alert' : '') : ''
        const pick = () => !locked && onPick(option)
        return (
          <div
            key={option}
            role="radio"
            tabIndex={0}
            aria-checked={selected}
            aria-disabled={locked}
            className={`g-chip ls-choice ${selected ? 'g-chip-selected' : ''} ${mark} ${locked ? 'ls-locked' : ''}`}
            onClick={pick}
            onKeyDown={(e) => radioKeys(e, pick)}
          >
            {arrow && (
              <span className="ls-arrow" aria-hidden="true">
                {arrow(option)}
              </span>
            )}
            <GlossedText text={text(option)} />
          </div>
        )
      })}
    </div>
  )
}
