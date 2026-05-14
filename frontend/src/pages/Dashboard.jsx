import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { periodoAPI, disciplinaAPI, aulaAPI, atividadeAPI } from '../services/api'

export default function Dashboard() {
  const [periodo, setPeriodo] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const periodoRes = await periodoAPI.getActive()
      setPeriodo(periodoRes.data)

      const disciplinas = await disciplinaAPI.listByPeriodo(periodoRes.data.id)
      const atividades = await atividadeAPI.listPending()
      const disciplinasData = disciplinas.data || []

      let totalAulas = 0
      let totalDificuldade = 0

      for (const disc of disciplinasData) {
        const aulas = await aulaAPI.listByDisciplina(disc.id)
        const aulasData = aulas.data || []
        totalAulas += aulasData.length
        aulasData.forEach(a => {
          totalDificuldade += a.dificuldade
        })
      }

      setStats({
        disciplinas: disciplinasData.length,
        aulas: totalAulas,
        atividades: (atividades.data || []).length,
        dificuldadeMedia: totalAulas > 0 ? (totalDificuldade / totalAulas).toFixed(1) : 0,
      })
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Erro ao carregar dados. Verifique se o servidor está rodando.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">
          {periodo ? `Período: ${periodo.nome}` : 'Nenhum período ativo'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {periodo && stats && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Disciplinas', value: stats.disciplinas },
              { label: 'Aulas', value: stats.aulas },
              { label: 'Atividades Pendentes', value: stats.atividades },
              { label: 'Dificuldade Média', value: `${stats.dificuldadeMedia}/5` },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:border-slate-300 transition-colors"
              >
                <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Period Info Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Período Ativo</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Nome</p>
                <p className="text-slate-900 font-medium">{periodo.nome}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Início</p>
                  <p className="text-slate-900 font-medium">
                    {new Date(periodo.dataInicio).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Fim</p>
                  <p className="text-slate-900 font-medium">
                    {new Date(periodo.dataFim).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!periodo && (
        <div className="bg-slate-100 rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-slate-600">Nenhum período ativo</p>
          <p className="text-sm text-slate-500 mt-1">
            Acesse Períodos para criar e ativar um
          </p>
        </div>
      )}
    </div>
  )
}
