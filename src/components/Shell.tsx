import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ProgressBar } from './ProgressBar'

interface ShellProps {
  title: string
  backTo: string
  progress?: { value: number; max: number }
  streak?: number
  children: ReactNode
}

/** Standard game screen: header (back link, title, streak), progress bar, body. */
export function Shell({ title, backTo, progress, streak, children }: ShellProps) {
  return (
    <div className="shell">
      <header className="shell-header">
        <Link to={backTo} className="shell-back" aria-label="Terug">
          &larr;
        </Link>
        <h2>{title}</h2>
        {typeof streak === 'number' && <span className="shell-streak">{streak}</span>}
      </header>
      {progress && (
        <div className="shell-progress">
          <ProgressBar value={progress.value} max={progress.max} />
          <span className="shell-progress-count">
            {progress.value} van {progress.max} in een keer goed
          </span>
        </div>
      )}
      <main className="shell-body">{children}</main>
    </div>
  )
}
