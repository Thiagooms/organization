import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import Dashboard from './pages/Dashboard'
import Periodos from './pages/Periodos'
import Disciplinas from './pages/Disciplinas'
import Aulas from './pages/Aulas'
import Atividades from './pages/Atividades'
import Prioridade from './pages/Prioridade'
import Monitoria from './pages/Monitoria'
import Quadro from './pages/Quadro'

function App() {
  return (
    <Router>
      <Layout>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/periodos" element={<Periodos />} />
            <Route path="/disciplinas" element={<Disciplinas />} />
            <Route path="/aulas" element={<Aulas />} />
            <Route path="/atividades" element={<Atividades />} />
            <Route path="/prioridade" element={<Prioridade />} />
            <Route path="/monitoria" element={<Monitoria />} />
            <Route path="/quadro" element={<Quadro />} />
          </Routes>
        </ErrorBoundary>
      </Layout>
    </Router>
  )
}

export default App
