import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, CheckCircle, AlertCircle, BookOpen, Users } from 'lucide-react'
import { monitoriaAPI } from '../services/api'

const TIPO_CONFIG = {
  PARTICIPANDO: { label: 'Participando', cls: 'bg-blue-100 text-blue-700 border border-blue-200' },
  SENDO_MONITOR: { label: 'Monitor', cls: 'bg-purple-100 text-purple-700 border border-purple-200' },
}

const STATUS_CONFIG = {
  AGUARDANDO_PROVA: { label: 'Aguardando Prova', cls: 'bg-amber-100 text-amber-700 border border-amber-200' },
  ATIVO: { label: 'Ativo', cls: 'bg-green-100 text-green-700 border border-green-200' },
  INATIVO: { label: 'Inativo', cls: 'bg-slate-100 text-slate-500 border border-slate-200' },
}

const EMPTY_FORM = {
  disciplina: '',
  professor: '',
  nomeMonitor: '',
  tipo: 'PARTICIPANDO',
  status: 'AGUARDANDO_PROVA',
  local: '',
  diasHorario: '',
  dataProva: '',
  dataInicio: '',
  observacoes: '',
}

export default function Monitoria() {
  const [monitorias, setMonitorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const res = await monitoriaAPI.list()
      setMonitorias(res.data || [])
    } catch {
      setError('Erro ao carregar monitorias')
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditing(null)
    setFormData(EMPTY_FORM)
    setError(null)
    setShowForm(true)
  }

  const openEdit = (m) => {
    setEditing(m)
    setFormData({
      disciplina: m.disciplina,
      professor: m.professor || '',
      nomeMonitor: m.nomeMonitor || '',
      tipo: m.tipo,
      status: m.status,
      local: m.local || '',
      diasHorario: m.diasHorario || '',
      dataProva: m.dataProva || '',
      dataInicio: m.dataInicio || '',
      observacoes: m.observacoes || '',
    })
    setError(null)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const payload = {
      ...formData,
      dataProva: formData.dataProva || null,
      dataInicio: formData.dataInicio || null,
    }

    try {
      if (editing) {
        await monitoriaAPI.update(editing.id, payload)
        setSuccess('Monitoria atualizada com sucesso!')
      } else {
        await monitoriaAPI.create(payload)
        setSuccess('Monitoria cadastrada com sucesso!')
      }
      setShowForm(false)
      setEditing(null)
      setTimeout(() => setSuccess(null), 3000)
      loadData()
    } catch {
      setError('Erro ao salvar. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleActivate = async (id) => {
    try {
      await monitoriaAPI.activate(id)
      setSuccess('Monitoria ativada!')
      setTimeout(() => setSuccess(null), 3000)
      loadData()
    } catch {
      setError('Erro ao ativar monitoria')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta monitoria?')) return
    try {
      await monitoriaAPI.delete(id)
      loadData()
    } catch {
      setError('Erro ao excluir monitoria')
    }
  }

  const formatDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : null

  const participando = monitorias.filter((m) => m.tipo === 'PARTICIPANDO')
  const sendoMonitor = monitorias.filter((m) => m.tipo === 'SENDO_MONITOR')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="w-1 h-12 rounded-full bg-purple-500 flex-shrink-0 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Monitoria</h1>
            <p className="text-slate-600 mt-1">Gerencie suas monitorias como aluno ou monitor</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nova Monitoria
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

      {monitorias.length === 0 ? (
        <div className="bg-slate-100 rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-slate-600">Nenhuma monitoria cadastrada</p>
          <p className="text-sm text-slate-500 mt-1">Clique em "Nova Monitoria" para começar</p>
        </div>
      ) : (
        <div className="space-y-8">
          {participando.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Participando</h2>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{participando.length}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {participando.map((m) => <MonitoriaCard key={m.id} m={m} onEdit={openEdit} onDelete={handleDelete} onActivate={handleActivate} formatDate={formatDate} />)}
              </div>
            </section>
          )}

          {sendoMonitor.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Sendo Monitor</h2>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{sendoMonitor.length}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {sendoMonitor.map((m) => <MonitoriaCard key={m.id} m={m} onEdit={openEdit} onDelete={handleDelete} onActivate={handleActivate} formatDate={formatDate} />)}
              </div>
            </section>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-5">
              {editing ? 'Editar Monitoria' : 'Nova Monitoria'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="PARTICIPANDO">Participando</option>
                    <option value="SENDO_MONITOR">Sendo Monitor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="AGUARDANDO_PROVA">Aguardando Prova</option>
                    <option value="ATIVO">Ativo</option>
                    <option value="INATIVO">Inativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Disciplina *</label>
                <input
                  type="text"
                  value={formData.disciplina}
                  onChange={(e) => setFormData({ ...formData, disciplina: e.target.value })}
                  placeholder="Ex: Estrutura de Dados"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Professor responsável</label>
                <input
                  type="text"
                  value={formData.professor}
                  onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
                  placeholder="Nome do professor"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>

              {formData.tipo === 'PARTICIPANDO' && formData.status !== 'AGUARDANDO_PROVA' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome do monitor</label>
                  <input
                    type="text"
                    value={formData.nomeMonitor}
                    onChange={(e) => setFormData({ ...formData, nomeMonitor: e.target.value })}
                    placeholder="Quem dá a monitoria"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
              )}

              {formData.status !== 'AGUARDANDO_PROVA' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Local</label>
                    <input
                      type="text"
                      value={formData.local}
                      onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                      placeholder="Sala, laboratório..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Dias / Horário</label>
                    <input
                      type="text"
                      value={formData.diasHorario}
                      onChange={(e) => setFormData({ ...formData, diasHorario: e.target.value })}
                      placeholder="Ex: Seg/Qua 14h-16h"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  </div>
                </div>
              )}

              {formData.status === 'AGUARDANDO_PROVA' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data da prova classificatória</label>
                  <input
                    type="date"
                    value={formData.dataProva}
                    onChange={(e) => setFormData({ ...formData, dataProva: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
              )}

              {formData.status === 'ATIVO' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data de início</label>
                  <input
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Anotações extras..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditing(null); setError(null) }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm"
                >
                  {submitting ? 'Salvando...' : editing ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function MonitoriaCard({ m, onEdit, onDelete, onActivate, formatDate }) {
  const tipo = TIPO_CONFIG[m.tipo]
  const status = STATUS_CONFIG[m.status]

  return (
    <div className="bg-white rounded-lg border border-slate-200 border-l-4 border-l-purple-400 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tipo.cls}`}>{tipo.label}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.cls}`}>{status.label}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {m.status === 'AGUARDANDO_PROVA' && (
            <button
              onClick={() => onActivate(m.id)}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Marcar como ativo"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onEdit(m)}
            className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(m.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className="font-semibold text-slate-900 text-base">{m.disciplina}</h3>

      <div className="mt-2 space-y-1">
        {m.professor && (
          <p className="text-sm text-slate-600">Prof. {m.professor}</p>
        )}
        {m.nomeMonitor && m.tipo === 'PARTICIPANDO' && (
          <p className="text-sm text-slate-600">Monitor: {m.nomeMonitor}</p>
        )}
        {m.local && (
          <p className="text-sm text-slate-500">📍 {m.local}</p>
        )}
        {m.diasHorario && (
          <p className="text-sm text-slate-500">🕐 {m.diasHorario}</p>
        )}
        {m.dataProva && m.status === 'AGUARDANDO_PROVA' && (
          <p className="text-sm font-medium text-amber-700 mt-2">
            Prova: {formatDate(m.dataProva)}
          </p>
        )}
        {m.dataInicio && m.status === 'ATIVO' && (
          <p className="text-sm text-green-700 mt-2">
            Início: {formatDate(m.dataInicio)}
          </p>
        )}
        {m.observacoes && (
          <p className="text-xs text-slate-400 mt-2 italic">{m.observacoes}</p>
        )}
      </div>
    </div>
  )
}
