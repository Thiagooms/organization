import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import Dashboard from './pages/Dashboard'
import Periodos from './pages/Periodos'
import Disciplinas from './pages/Disciplinas'
import Aulas from './pages/Aulas'
import Atividades from './pages/Atividades'

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
          </Routes>
        </ErrorBoundary>
      </Layout>
    </Router>
  )
}

export default App
