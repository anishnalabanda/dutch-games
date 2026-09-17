import { HashRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './store/StoreProvider'
import { Hub } from './pages/Hub'
import { ExamPage } from './pages/ExamPage'
import { GamePage } from './pages/GamePage'
import './styles/global.css'
import './styles/components.css'
import './styles/games.css'

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/:examId" element={<ExamPage />} />
          <Route path="/:examId/:slug" element={<GamePage />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  )
}
