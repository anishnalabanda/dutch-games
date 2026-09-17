import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { exams } from '../games/exams'
import { games, gameSlug } from '../games/manifest'
import { Card } from '../components/Card'
import { Tag } from '../components/Tag'
import { useProgressStore } from '../store/StoreProvider'

export function ExamPage() {
  const { examId } = useParams<{ examId: string }>()
  const store = useProgressStore()
  const [doneKeys, setDoneKeys] = useState<Record<string, boolean>>({})
  const exam = exams.find((e) => e.id === examId)
  const examGames = games.filter((g) => g.exam === examId)

  useEffect(() => {
    let cancelled = false
    void store.all().then((data) => {
      if (cancelled) return
      const done: Record<string, boolean> = {}
      for (const [key, value] of Object.entries(data)) {
        if (value && typeof value === 'object' && (value as { done?: boolean }).done) {
          done[key] = true
        }
      }
      setDoneKeys(done)
    })
    return () => {
      cancelled = true
    }
  }, [store])

  if (!exam) {
    return (
      <div className="exam-page">
        <p>Onbekend examen.</p>
        <Link to="/" className="exam-page-back">
          &larr; Overzicht
        </Link>
      </div>
    )
  }

  const core = examGames.filter((g) => g.core)
  const coreDone = core.filter((g) => doneKeys[g.id]).length

  return (
    <div className="exam-page">
      <Link to="/" className="exam-page-back">
        &larr; Overzicht
      </Link>
      <h1>{exam.title}</h1>
      {examGames.length > 0 && (
        <p className="exam-page-count">
          {coreDone} van {core.length} kerngames klaar
        </p>
      )}
      {examGames.length === 0 ? (
        <Card className="exam-page-empty">Nog geen games voor dit examen.</Card>
      ) : (
        <div className="exam-page-grid">
          {examGames.map((g) => (
            <Link key={g.id} to={`/${exam.id}/${gameSlug(g.id)}`} className="exam-page-game-link">
              <Card className={doneKeys[g.id] ? 'exam-page-game-done' : ''}>
                <div className="exam-page-game-head">
                  <h3>{g.title}</h3>
                  {doneKeys[g.id] && <Tag tone="ok">Klaar</Tag>}
                </div>
                {g.subtitle && <p className="exam-page-game-subtitle">{g.subtitle}</p>}
                <Tag>{g.core ? 'Kern' : 'Extra'}</Tag>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
