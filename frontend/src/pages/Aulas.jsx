import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Trash2, Edit2, AlertCircle, CheckCircle, Check, X } from 'lucide-react'
import { periodoAPI, disciplinaAPI, aulaAPI } from '../services/api'

export default function Aulas() {
  const [disciplinas, setDisciplinas] = useState([])
  const [expandedDisciplinas, setExpandedDisciplinas] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [selectedDisciplina, setSelectedDisciplina] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingAula, setEditingAula] = useState(null)
  const [formData, setFormData] = useState({
    data: '',
    conteudo: '',
    satisfacao: 3,
    dificuldade: 3,
    duvidas: '',
    observacoes: '',
    presente: true,
  })

  useEffect(() => {
    loadDisciplinas()
  }, [])

  const loadDisciplinas = async () => {
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
          return {
            ...disc,
            aulas: aulasRes.data || [],
          }
        })
      )

      setDisciplinas(disciplinasComAulas)
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleDisciplina = (id) => {
    const newExpanded = new Set(expandedDisciplinas)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedDisciplinas(newExpanded)
  }

  const handleCreateAula = async (e) => {
    e.preventDefault()
    if (!selectedDisciplina) return

    setError(null)
    setSubmitting(true)

    try {
      await aulaAPI.create(selectedDisciplina.id, {
        ...formData,
        satisfacao: parseInt(formData.satisfacao),
        dificuldade: parseInt(formData.dificuldade),
      })
      setSuccess('Aula criada com sucesso!')
      setFormData({
        data: '',
        conteudo: '',
        satisfacao: 3,
        dificuldade: 3,
        duvidas: '',
        observacoes: '',
        presente: true,
      })
      setShowForm(false)
      setTimeout(() => setSuccess(null), 3000)
      loadDisciplinas()
    } catch (err) {
      setError('Erro ao criar aula. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateAula = async (e) => {
    e.preventDefault()
    if (!editingAula) return

    setError(null)
    setSubmitting(true)

    try {
      await aulaAPI.update(editingAula.id, {
        ...formData,
        satisfacao: parseInt(formData.satisfacao),
        dificuldade: parseInt(formData.dificuldade),
      })
      setSuccess('Aula atualizada com sucesso!')
      setFormData({
        data: '',
        conteudo: '',
        satisfacao: 3,
        dificuldade: 3,
        duvidas: '',
        observacoes: '',
        presente: true,
      })
      setEditingAula(null)
      setShowForm(false)
      setTimeout(() => setSuccess(null), 3000)
      loadDisciplinas()
    } catch (err) {
      setError('Erro ao atualizar aula. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteAula = async (aulaId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta aula?')) return

    try {
      await aulaAPI.delete(aulaId)
      loadDisciplinas()
    } catch (error) {
      console.error('Erro ao deletar aula:', error)
    }
  }

  const handleEditClick = (aula) => {
    setEditingAula(aula)
    setFormData({
      data: aula.data,
      conteudo: aula.conteudo,
      satisfacao: aula.satisfacao,
      dificuldade: aula.dificuldade,
      duvidas: aula.duvidas || '',
      observacoes: aula.observacoes || '',
      presente: aula.presente,
    })
    setShowForm(true)
  }

  const openNewAulaForm = (disc) => {
    setEditingAula(null)
    setSelectedDisciplina(disc)
    setFormData({
      data: '',
      conteudo: '',
      satisfacao: 3,
      dificuldade: 3,
      duvidas: '',
      observacoes: '',
      presente: true,
    })
    setError(null)
    setShowForm(true)
  }

  const getScoreColor = (score) => {
    if (score <= 2) return 'text-red-600'
    if (score <= 3) return 'text-yellow-600'
    return 'text-green-600'
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
          <div className="w-1 h-5 rounded-full bg-disciplina-500" />
          <div className="w-1 h-5 rounded-full bg-aula-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Aulas</h1>
          <p className="text-slate-600 mt-1">Registre e organize suas aulas por disciplina</p>
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
            Crie uma disciplina para começar a registrar aulas
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {disciplinas.map((disc) => (
            <div key={disc.id} className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleDisciplina(disc.id)}
                className="w-full px-6 py-4 bg-white hover:bg-disciplina-50 transition-colors flex items-center justify-between"
              >
                <div className="text-left flex-1 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-disciplina-500 flex-shrink-0" />
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{disc.nome}</h2>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-slate-600">{disc.aulas.length} aulas</p>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-green-600 font-medium">{disc.aulas.filter(a => a.presente).length} presenças</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <X className="w-4 h-4 text-red-600" />
                        <p className="text-sm text-red-600 font-medium">{disc.aulas.filter(a => !a.presente).length} faltas</p>
                      </div>
                    </div>
                  </div>
                </div>
                {expandedDisciplinas.has(disc.id) ? (
                  <ChevronUp className="w-5 h-5 text-disciplina-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {expandedDisciplinas.has(disc.id) && (
                <div className="border-t border-disciplina-100 bg-disciplina-50 p-6 space-y-4">
                  <button
                    onClick={() => openNewAulaForm(disc)}
                    className="flex items-center gap-2 px-4 py-2 text-aula-700 bg-white border border-aula-200 rounded-lg hover:bg-aula-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Nova Aula
                  </button>

                  {disc.aulas.length === 0 ? (
                    <p className="text-slate-600 text-sm py-4">Nenhuma aula registrada</p>
                  ) : (
                    <div className="space-y-3">
                      {disc.aulas.map((aula) => (
                        <div key={aula.id} className="bg-white rounded-lg border border-aula-200 border-l-4 border-l-aula-500 p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <p className="text-sm text-aula-600 font-medium">
                                {new Date(aula.data).toLocaleDateString('pt-BR')}
                              </p>
                              <h3 className="text-slate-900 font-medium mt-1">{aula.conteudo}</h3>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => handleEditClick(aula)}
                                className="p-2 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAula(aula.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Deletar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className={`grid gap-4 mb-3 ${aula.presente ? 'grid-cols-3' : 'grid-cols-1'}`}>
                            {aula.presente && (
                              <>
                                <div>
                                  <p className="text-xs text-slate-600">Satisfação</p>
                                  <p className={`text-lg font-semibold ${getScoreColor(aula.satisfacao)}`}>
                                    {aula.satisfacao}/5
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-600">Dificuldade</p>
                                  <p className={`text-lg font-semibold ${getScoreColor(5 - aula.dificuldade)}`}>
                                    {aula.dificuldade}/5
                                  </p>
                                </div>
                              </>
                            )}
                            <div>
                              <p className="text-xs text-slate-600">Presença</p>
                              <div className="flex items-center gap-1">
                                {aula.presente ? (
                                  <>
                                    <Check className="w-5 h-5 text-green-600" />
                                    <span className="text-sm font-semibold text-green-600">Presente</span>
                                  </>
                                ) : (
                                  <>
                                    <X className="w-5 h-5 text-red-600" />
                                    <span className="text-sm font-semibold text-red-600">Faltou</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {(aula.duvidas || aula.observacoes) && (
                            <div className="pt-3 border-t border-slate-200 space-y-2 text-sm">
                              {aula.duvidas && (
                                <div>
                                  <p className="text-slate-600">Dúvidas:</p>
                                  <p className="text-slate-900">{aula.duvidas}</p>
                                </div>
                              )}
                              {aula.observacoes && (
                                <div>
                                  <p className="text-slate-600">Observações:</p>
                                  <p className="text-slate-900">{aula.observacoes}</p>
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
              {editingAula ? 'Editar Aula' : `Nova Aula - ${selectedDisciplina?.nome}`}
            </h2>

            <form onSubmit={editingAula ? handleUpdateAula : handleCreateAula} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Data</label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Conteúdo</label>
                <textarea
                  value={formData.conteudo}
                  onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${formData.presente ? 'text-slate-700' : 'text-slate-400'}`}>
                  Satisfação: {formData.satisfacao}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.satisfacao}
                  onChange={(e) => setFormData({ ...formData, satisfacao: e.target.value })}
                  disabled={!formData.presente}
                  className={`w-full ${!formData.presente ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${formData.presente ? 'text-slate-700' : 'text-slate-400'}`}>
                  Dificuldade: {formData.dificuldade}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.dificuldade}
                  onChange={(e) => setFormData({ ...formData, dificuldade: e.target.value })}
                  disabled={!formData.presente}
                  className={`w-full ${!formData.presente ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Dúvidas (opcional)</label>
                <textarea
                  value={formData.duvidas}
                  onChange={(e) => setFormData({ ...formData, duvidas: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Dúvidas da aula..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Observações (opcional)</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Observações adicionais..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Presença</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, presente: true })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                      formData.presente
                        ? 'bg-green-50 border-green-500 text-green-700 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Check className="w-5 h-5" />
                    Presente
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, presente: false })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                      !formData.presente
                        ? 'bg-red-50 border-red-500 text-red-700 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <X className="w-5 h-5" />
                    Faltou
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingAula(null)
                    setError(null)
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-aula-600 text-white rounded-lg hover:bg-aula-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Salvando...' : editingAula ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
