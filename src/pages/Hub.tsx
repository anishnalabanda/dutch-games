import { useEffect, useState } from 'react'
import { ExamCard } from '../components/ExamCard'
import { AuthBar } from '../components/AuthBar'
import { exams } from '../games/exams'
import { games } from '../games/manifest'
import { useProgressStore } from '../store/StoreProvider'

export function Hub() {
  const store = useProgressStore()
  const [doneKeys, setDoneKeys] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let cancelled = false
    store.all().then((data) => {
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

  return (
    <div className="hub">
      <header className="hub-header">
        <h1>Inburgering A2</h1>
        <AuthBar />
      </header>
      <div className="hub-grid">
        {exams.map((exam) => {
          const examGames = games.filter((g) => g.exam === exam.id)
          const core = examGames.filter((g) => g.core)
          const optional = examGames.filter((g) => !g.core)
          return (
            <ExamCard
              key={exam.id}
              exam={exam}
              coreDone={core.filter((g) => doneKeys[g.id]).length}
              coreTotal={core.length}
              optionalDone={optional.filter((g) => doneKeys[g.id]).length}
              optionalTotal={optional.length}
            />
          )
        })}
      </div>
    </div>
  )
}
