import { useEffect, useState } from 'react'
import { Plus, AlertCircle, CheckCircle, Pencil } from 'lucide-react'
import { periodoAPI, disciplinaAPI } from '../services/api'

export default function Disciplinas() {
  const [disciplinas, setDisciplinas] = useState([])
  const [periodo, setPeriodo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    professor: '',
    cargaHoraria: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [editFormData, setEditFormData] = useState({
    nome: '',
    professor: '',
    cargaHoraria: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const periodoRes = await periodoAPI.getActive()
      setPeriodo(periodoRes.data)

      const discRes = await disciplinaAPI.listByPeriodo(periodoRes.data.id)
      setDisciplinas(discRes.data || [])
    } catch (error) {
      setError('Erro ao carregar disciplinas')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await disciplinaAPI.create(periodo.id, {
        ...formData,
        cargaHoraria: parseInt(formData.cargaHoraria),
      })
      setSuccess('Disciplina criada com sucesso!')
      setFormData({ nome: '', professor: '', cargaHoraria: '' })
      setShowForm(false)
      setTimeout(() => setSuccess(null), 3000)
      loadData()
    } catch (err) {
      setError('Erro ao criar disciplina. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (disc) => {
    setEditingId(disc.id)
    setEditFormData({
      nome: disc.nome,
      professor: disc.professor,
      cargaHoraria: String(disc.cargaHoraria),
    })
    setError(null)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await disciplinaAPI.update(editingId, {
        ...editFormData,
        cargaHoraria: parseInt(editFormData.cargaHoraria),
      })
      setSuccess('Disciplina atualizada com sucesso!')
      setEditingId(null)
      setTimeout(() => setSuccess(null), 3000)
      loadData()
    } catch {
      setError('Erro ao atualizar disciplina. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="w-1 h-12 rounded-full bg-disciplina-500 flex-shrink-0 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Disciplinas</h1>
            {periodo && (
              <p className="text-slate-600 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-periodo-500 inline-block" />
                Período: {periodo.nome}
              </p>
            )}
          </div>
        </div>
        {periodo && (
          <button
            onClick={() => {
              setShowForm(!showForm)
              setError(null)
            }}
            className="flex items-center gap-2 bg-disciplina-600 text-white px-4 py-2 rounded-lg hover:bg-disciplina-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Disciplina
          </button>
        )}
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
          <input
            type="text"
            placeholder="Nome da disciplina"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
            required
          />
          <input
            type="text"
            placeholder="Professor"
            value={formData.professor}
            onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
            required
          />
          <input
            type="number"
            placeholder="Carga Horária (h)"
            value={formData.cargaHoraria}
            onChange={(e) => setFormData({ ...formData, cargaHoraria: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
            min="1"
            required
          />
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-disciplina-600 text-white px-4 py-2 rounded-lg hover:bg-disciplina-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      ) : disciplinas.length === 0 ? (
        <div className="bg-slate-100 rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-slate-600">Nenhuma disciplina cadastrada</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {disciplinas.map((disc) => (
            <div
              key={disc.id}
              className="bg-white rounded-lg border border-slate-200 border-l-4 border-l-disciplina-500 p-6 hover:border-disciplina-300 transition-colors"
            >
              {editingId === disc.id ? (
                <form onSubmit={handleUpdate} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nome da disciplina"
                    value={editFormData.nome}
                    onChange={(e) => setEditFormData({ ...editFormData, nome: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Professor"
                    value={editFormData.professor}
                    onChange={(e) => setEditFormData({ ...editFormData, professor: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Carga Horária (h)"
                    value={editFormData.cargaHoraria}
                    onChange={(e) => setEditFormData({ ...editFormData, cargaHoraria: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20"
                    min="1"
                    required
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-disciplina-600 text-white px-4 py-2 rounded-lg hover:bg-disciplina-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditingId(null); setError(null) }}
                      className="flex-1 bg-slate-200 text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{disc.nome}</h3>
                    <p className="text-sm text-slate-600 mt-2">Professor: {disc.professor}</p>
                    <p className="text-sm text-slate-600">Carga Horária: {disc.cargaHoraria}h</p>
                  </div>
                  <button
                    onClick={() => handleEdit(disc)}
                    className="text-slate-400 hover:text-disciplina-600 transition-colors p-1 rounded"
                    title="Editar disciplina"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
