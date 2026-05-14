import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Trash2, Edit2, Check, AlertCircle, CheckCircle } from 'lucide-react'
import { periodoAPI, disciplinaAPI, aulaAPI, atividadeAPI } from '../services/api'

export default function Atividades() {
  const [disciplinas, setDisciplinas] = useState([])
  const [expandedItems, setExpandedItems] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [selectedAula, setSelectedAula] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingAtividade, setEditingAtividade] = useState(null)
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    dataEntrega: '',
    tipo: 'ATIVIDADE',
    nota: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const periodoRes = await periodoAPI.getActive()
      if (!periodoRes.data?.id) {
        setLoading(false)
        return
      }

      const discRes = await disciplinaAPI.listByPeriodo(periodoRes.data.id)

      const disciplinasComAulas = await Promise.all(
        discRes.data.map(async (disc) => {
          const aulasRes = await aulaAPI.listByDisciplina(disc.id)

          const aulasComAtividades = await Promise.all(
            aulasRes.data.map(async (aula) => {
              const atividadesRes = await atividadeAPI.listByAula(aula.id)
              return {
                ...aula,
                atividades: atividadesRes.data || [],
              }
            })
          )

          return {
            ...disc,
            aulas: aulasComAtividades,
          }
        })
      )

      setDisciplinas(disciplinasComAulas)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const handleCreateAtividade = async (e) => {
    e.preventDefault()
    if (!selectedAula) return

    setError(null)
    setSubmitting(true)

    try {
      const data = {
        ...formData,
        nota: formData.nota ? parseFloat(formData.nota) : null,
      }
      await atividadeAPI.create(selectedAula.id, data)
      setSuccess('Atividade criada com sucesso!')
      setFormData({
        titulo: '',
        descricao: '',
        dataEntrega: '',
        tipo: 'ATIVIDADE',
        nota: '',
      })
      setShowForm(false)
      setTimeout(() => setSuccess(null), 3000)
      loadData()
    } catch (err) {
      setError('Erro ao criar atividade. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateAtividade = async (e) => {
    e.preventDefault()
    if (!editingAtividade) return

    setError(null)
    setSubmitting(true)

    try {
      const data = {
        ...formData,
        nota: formData.nota ? parseFloat(formData.nota) : null,
      }
      await atividadeAPI.update(editingAtividade.id, data)
      setSuccess('Atividade atualizada com sucesso!')
      setFormData({
        titulo: '',
        descricao: '',
        dataEntrega: '',
        tipo: 'ATIVIDADE',
        nota: '',
      })
      setEditingAtividade(null)
      setShowForm(false)
      setTimeout(() => setSuccess(null), 3000)
      loadData()
    } catch (err) {
      setError('Erro ao atualizar atividade. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCompleteAtividade = async (atividadeId) => {
    try {
      await atividadeAPI.markComplete(atividadeId)
      loadData()
    } catch (error) {
      console.error('Erro ao completar atividade:', error)
    }
  }

  const handleDeleteAtividade = async (atividadeId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta atividade?')) return

    try {
      await atividadeAPI.delete(atividadeId)
      loadData()
    } catch (error) {
      console.error('Erro ao deletar atividade:', error)
    }
  }

  const handleEditClick = (atividade) => {
    setEditingAtividade(atividade)
    setFormData({
      titulo: atividade.titulo,
      descricao: atividade.descricao,
      dataEntrega: atividade.dataEntrega,
      tipo: atividade.tipo,
      nota: atividade.nota ? atividade.nota.toString() : '',
    })
    setShowForm(true)
  }

  const openNewAtividadeForm = (aula) => {
    setEditingAtividade(null)
    setSelectedAula(aula)
    setFormData({
      titulo: '',
      descricao: '',
      dataEntrega: '',
      tipo: 'ATIVIDADE',
      nota: '',
    })
    setError(null)
    setShowForm(true)
  }

  const getTipoLabel = (tipo) => {
    const labels = {
      ATIVIDADE: 'Atividade',
      PROVA: 'Prova',
      TRABALHO: 'Trabalho',
    }
    return labels[tipo] || tipo
  }

  const getTipoBgColor = (tipo) => {
    const colors = {
      ATIVIDADE: 'bg-atividade-100 text-atividade-600',
      PROVA: 'bg-prova-100 text-prova-600',
      TRABALHO: 'bg-trabalho-100 text-trabalho-600',
    }
    return colors[tipo] || 'bg-slate-100 text-slate-800'
  }

  const getTipoBorderColor = (tipo) => {
    const colors = {
      ATIVIDADE: 'border-l-atividade-500',
      PROVA: 'border-l-prova-500',
      TRABALHO: 'border-l-trabalho-500',
    }
    return colors[tipo] || 'border-l-slate-300'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex flex-col gap-1 flex-shrink-0 mt-1">
          <div className="w-1 h-4 rounded-full bg-disciplina-500" />
          <div className="w-1 h-4 rounded-full bg-aula-500" />
          <div className="w-1 h-4 rounded-full bg-atividade-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Atividades</h1>
          <p className="text-slate-600 mt-1">Organize suas atividades, provas e trabalhos</p>
        </div>
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

      {disciplinas.length === 0 ? (
        <div className="bg-slate-100 rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-slate-600">Nenhuma disciplina disponível</p>
          <p className="text-sm text-slate-500 mt-1">
            Crie uma disciplina e registre aulas para adicionar atividades
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {disciplinas.map((disc) => (
            <div key={disc.id} className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleExpand(`disc-${disc.id}`)}
                className="w-full px-6 py-4 bg-white hover:bg-disciplina-50 transition-colors flex items-center justify-between"
              >
                <div className="text-left flex-1 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-disciplina-500 flex-shrink-0" />
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{disc.nome}</h2>
                    <p className="text-sm text-slate-600">{disc.aulas.length} aulas</p>
                  </div>
                </div>
                {expandedItems.has(`disc-${disc.id}`) ? (
                  <ChevronUp className="w-5 h-5 text-disciplina-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {expandedItems.has(`disc-${disc.id}`) && (
                <div className="border-t border-disciplina-100 bg-disciplina-50 p-6 space-y-4">
                  {disc.aulas.length === 0 ? (
                    <p className="text-slate-600 text-sm">Nenhuma aula registrada</p>
                  ) : (
                    <div className="space-y-3">
                      {disc.aulas.map((aula) => (
                        <div key={aula.id} className="border border-aula-200 border-l-4 border-l-aula-500 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => toggleExpand(`aula-${aula.id}`)}
                            className="w-full px-4 py-3 hover:bg-aula-50 transition-colors flex items-center justify-between"
                          >
                            <div className="text-left flex-1 flex items-center gap-3">
                              <span className="w-2 h-2 rounded-full bg-aula-500 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-aula-600 font-medium">
                                  {new Date(aula.data).toLocaleDateString('pt-BR')}
                                </p>
                                <p className="text-slate-900 font-medium text-sm">{aula.conteudo}</p>
                              </div>
                            </div>
                            <div className="ml-4">
                              {expandedItems.has(`aula-${aula.id}`) ? (
                                <ChevronUp className="w-4 h-4 text-aula-600" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          </button>

                          {expandedItems.has(`aula-${aula.id}`) && (
                            <div className="border-t border-aula-100 bg-aula-50 p-4 space-y-3">
                              <button
                                onClick={() => openNewAtividadeForm(aula)}
                                className="flex items-center gap-2 px-3 py-2 text-atividade-700 bg-white border border-atividade-200 rounded hover:bg-atividade-50 transition-colors text-sm w-full justify-center"
                              >
                                <Plus className="w-4 h-4" />
                                Nova Atividade
                              </button>

                              {aula.atividades.length === 0 ? (
                                <p className="text-slate-600 text-sm py-2">Nenhuma atividade registrada</p>
                              ) : (
                                <div className="space-y-2">
                                  {aula.atividades.map((atividade) => (
                                    <div
                                      key={atividade.id}
                                      className={`rounded-lg border-l-4 p-3 ${getTipoBorderColor(atividade.tipo)} ${
                                        atividade.concluida
                                          ? 'bg-trabalho-50 border border-trabalho-200'
                                          : 'bg-white border border-slate-200'
                                      }`}
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs px-2 py-1 rounded ${getTipoBgColor(atividade.tipo)}`}>
                                              {getTipoLabel(atividade.tipo)}
                                            </span>
                                            {atividade.concluida && (
                                              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                                                Concluída
                                              </span>
                                            )}
                                          </div>
                                          <h4 className="text-slate-900 font-medium text-sm">{atividade.titulo}</h4>
                                          {atividade.descricao && (
                                            <p className="text-slate-600 text-xs mt-1">{atividade.descricao}</p>
                                          )}
                                          <p className="text-slate-600 text-xs mt-2">
                                            Entrega: {new Date(atividade.dataEntrega).toLocaleDateString('pt-BR')}
                                          </p>
                                          {atividade.nota !== null && (
                                            <p className="text-slate-900 text-xs font-medium mt-1">
                                              Nota: {atividade.nota}
                                            </p>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          {!atividade.concluida && (
                                            <button
                                              onClick={() => handleCompleteAtividade(atividade.id)}
                                              className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors"
                                              title="Marcar como concluída"
                                            >
                                              <Check className="w-4 h-4" />
                                            </button>
                                          )}
                                          <button
                                            onClick={() => handleEditClick(atividade)}
                                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                            title="Editar"
                                          >
                                            <Edit2 className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteAtividade(atividade.id)}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Deletar"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editingAtividade ? 'Editar Atividade' : `Nova Atividade`}
            </h2>

            <form onSubmit={editingAtividade ? handleUpdateAtividade : handleCreateAtividade} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ATIVIDADE">Atividade</option>
                  <option value="PROVA">Prova</option>
                  <option value="TRABALHO">Trabalho</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Título</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Descrição (opcional)</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Descrição da atividade..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Data de Entrega</label>
                <input
                  type="date"
                  value={formData.dataEntrega}
                  onChange={(e) => setFormData({ ...formData, dataEntrega: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nota (opcional)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.nota}
                  onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 9.5"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingAtividade(null)
                    setError(null)
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-atividade-600 text-white rounded-lg hover:bg-atividade-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Salvando...' : editingAtividade ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
