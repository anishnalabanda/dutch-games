import { HashRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider, useAuthSession } from './store/StoreProvider'
import { Hub } from './pages/Hub'
import { ExamPage } from './pages/ExamPage'
import { GamePage } from './pages/GamePage'
import { SignIn } from './pages/SignIn'
import './styles/global.css'
import './styles/components.css'
import './styles/games.css'

function Gate() {
  const { session, loading } = useAuthSession()
  if (loading) return null
  if (!session) return <SignIn />
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/:examId" element={<ExamPage />} />
        <Route path="/:examId/:slug" element={<GamePage />} />
      </Routes>
    </HashRouter>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Gate />
    </StoreProvider>
  )
}
