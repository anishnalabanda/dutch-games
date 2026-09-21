import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ProgressBar } from './ProgressBar'
import { Tooltip } from './Tooltip'
import { useCurrentGame } from '../games/currentGame'

interface ShellProps {
  title: string
  backTo: string
  progress?: { value: number; max: number }
  streak?: number
  children: ReactNode
}

/** Standard game screen: header (back link, title, streak), progress bar, body. */
export function Shell({ title, backTo, progress, streak, children }: ShellProps) {
  // The title stays Dutch, so what the game drills lives in the subtitle: on
  // hover or keyboard focus, like every other Dutch word in the app.
  const meta = useCurrentGame()
  return (
    <div className="shell">
      <header className="shell-header">
        <Link to={backTo} className="shell-back" aria-label="Back">
          &larr;
        </Link>
        <h2>
          {meta?.subtitle ? (
            <Tooltip content={meta.subtitle} placement="below">
              <span className="shell-title">{title}</span>
            </Tooltip>
          ) : (
            title
          )}
        </h2>
        {typeof streak === 'number' && <span className="shell-streak">{streak}</span>}
      </header>
      {progress && (
        <div className="shell-progress">
          <ProgressBar value={progress.value} max={progress.max} />
          <span className="shell-progress-count">
            {progress.value} of {progress.max} right first time
          </span>
        </div>
      )}
      <main className="shell-body">{children}</main>
    </div>
  )
}
