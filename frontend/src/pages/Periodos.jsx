import { useEffect, useState } from 'react'
import { Plus, AlertCircle, CheckCircle } from 'lucide-react'
import { periodoAPI } from '../services/api'

export default function Periodos() {
  const [periodos, setPeriodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formData, setFormData] = useState({ nome: '', dataInicio: '', dataFim: '' })

  useEffect(() => {
    loadPeriodos()
  }, [])

  const loadPeriodos = async () => {
    try {
      const res = await periodoAPI.list()
      setPeriodos(res.data)
    } catch (err) {
      setError('Erro ao carregar períodos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await periodoAPI.create(formData)
      setSuccess('Período criado com sucesso!')
      setFormData({ nome: '', dataInicio: '', dataFim: '' })
      setShowForm(false)
      setTimeout(() => setSuccess(null), 3000)
      loadPeriodos()
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Este período já existe. Use um nome diferente.')
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Erro ao criar período. Tente novamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleActivate = async (id) => {
    try {
      await periodoAPI.activate(id)
      setSuccess('Período ativado!')
      setTimeout(() => setSuccess(null), 3000)
      loadPeriodos()
    } catch (err) {
      setError('Erro ao ativar período')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="w-1 h-12 rounded-full bg-periodo-500 flex-shrink-0 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Períodos</h1>
            <p className="text-slate-600 mt-1">Gerencie seus períodos letivos</p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setError(null)
          }}
          className="flex items-center gap-2 bg-periodo-600 text-white px-4 py-2 rounded-lg hover:bg-periodo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Período
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-slate-200 p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome (ex: 2026.1)</label>
            <input
              type="text"
              placeholder="2026.1"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data de Início</label>
              <input
                type="date"
                value={formData.dataInicio}
                onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data de Término</label>
              <input
                type="date"
                value={formData.dataFim}
                onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-periodo-600 text-white px-4 py-2 rounded-lg hover:bg-periodo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setError(null)
              }}
              className="flex-1 bg-slate-200 text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center text-slate-500">Carregando...</div>
      ) : periodos.length === 0 ? (
        <div className="bg-slate-100 rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-slate-600">Nenhum período cadastrado</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {periodos.map((periodo) => (
            <div
              key={periodo.id}
              className={`bg-white rounded-lg border-l-4 border border-slate-200 p-6 transition-colors ${
                periodo.ativo ? 'border-l-periodo-500' : 'border-l-slate-300 hover:border-l-periodo-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">{periodo.nome}</h3>
                    {periodo.ativo && (
                      <span className="px-2 py-0.5 bg-periodo-100 text-periodo-700 text-xs font-semibold rounded-full">
                        Ativo
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    {new Date(periodo.dataInicio).toLocaleDateString('pt-BR')} até{' '}
                    {new Date(periodo.dataFim).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {!periodo.ativo && (
                  <button
                    onClick={() => handleActivate(periodo.id)}
                    className="px-4 py-2 bg-periodo-600 text-white rounded-lg hover:bg-periodo-700 transition-colors text-sm"
                  >
                    Ativar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
