import { useParams } from 'react-router-dom'
import { games, gameSlug } from '../games/manifest'
import { CurrentGameProvider } from '../games/currentGame'

export function GamePage() {
  const { examId, slug } = useParams<{ examId: string; slug: string }>()
  const game = games.find((g) => g.exam === examId && gameSlug(g.id) === slug)

  if (!game) {
    return <p>Unknown game.</p>
  }

  const GameComponent = game.component
  return (
    <CurrentGameProvider meta={game}>
      <GameComponent />
    </CurrentGameProvider>
  )
}
