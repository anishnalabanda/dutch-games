import { Link } from 'react-router-dom'
import { Card } from './Card'
import { ProgressBar } from './ProgressBar'
import type { ExamInfo } from '../games/exams'

interface ExamCardProps {
  exam: ExamInfo
  coreDone: number
  coreTotal: number
  optionalDone: number
  optionalTotal: number
}

/** Progress counts the core games; optional ones are shown apart, so "ready" stays honest. */
export function ExamCard({
  exam,
  coreDone,
  coreTotal,
  optionalDone,
  optionalTotal,
}: ExamCardProps) {
  return (
    <Link to={`/${exam.id}`} className="exam-card-link">
      <Card className="exam-card">
        <h3>{exam.title}</h3>
        <p className="exam-card-subtitle">{exam.subtitle}</p>
        <div className="exam-card-foot">
          <ProgressBar value={coreDone} max={coreTotal} />
          <span className="exam-card-count">
            {coreTotal === 0 ? 'No games yet' : `${coreDone} of ${coreTotal} core games`}
          </span>
          <span className="exam-card-extra">
            {optionalTotal > 0 ? `${optionalDone} of ${optionalTotal} extra` : '\u00a0'}
          </span>
        </div>
      </Card>
    </Link>
  )
}
