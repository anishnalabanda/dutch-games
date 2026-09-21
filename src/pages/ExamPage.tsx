import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { exams } from '../games/exams'
import { games, gameSlug } from '../games/manifest'
import { Card } from '../components/Card'
import { Tag } from '../components/Tag'
import { ProgressBar } from '../components/ProgressBar'
import { countFinished, isDone } from '../games/progress'
import { useProgressStore } from '../store/StoreProvider'

export function ExamPage() {
  const { examId } = useParams<{ examId: string }>()
  const store = useProgressStore()
  const [saved, setSaved] = useState<Record<string, unknown>>({})
  const exam = exams.find((e) => e.id === examId)
  const examGames = games.filter((g) => g.exam === examId)

  useEffect(() => {
    let cancelled = false
    void store.all().then((data) => {
      if (!cancelled) setSaved(data)
    })
    return () => {
      cancelled = true
    }
  }, [store])

  if (!exam) {
    return (
      <div className="exam-page">
        <p>Unknown exam.</p>
        <Link to="/" className="exam-page-back">
          &larr; Overview
        </Link>
      </div>
    )
  }

  const core = examGames.filter((g) => g.core)
  const coreDone = core.filter((g) => isDone(saved[g.id])).length

  return (
    <div className="exam-page">
      <Link to="/" className="exam-page-back">
        &larr; Overview
      </Link>
      <h1>{exam.title}</h1>
      {examGames.length > 0 && (
        <p className="exam-page-count">
          {coreDone} of {core.length} core games done
        </p>
      )}
      {examGames.length === 0 ? (
        <Card className="exam-page-empty">No games for this exam yet.</Card>
      ) : (
        <div className="exam-page-grid">
          {examGames.map((g) => {
            const finished = countFinished(saved[g.id])
            const done = isDone(saved[g.id])
            return (
              <Link key={g.id} to={`/${exam.id}/${gameSlug(g.id)}`} className="exam-page-game-link">
                <Card className={done ? 'exam-page-game-done' : ''}>
                  <div className="exam-page-game-head">
                    <h3>{g.title}</h3>
                    {done && <Tag tone="ok">Done</Tag>}
                  </div>
                  <p className="exam-page-game-subtitle">{g.subtitle}</p>
                  <div className="exam-page-game-foot">
                    <Tag>{g.core ? 'Core' : 'Extra'}</Tag>
                    <ProgressBar value={finished} max={g.total} />
                    <span className="exam-page-game-count">
                      {finished} of {g.total} done
                    </span>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
