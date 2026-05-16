import { useEffect, useState } from 'react'
import { AlertCircle, X, Sun, Moon } from 'lucide-react'
import axios from 'axios'

const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']

const turnosConfig = {
  MANHA: {
    label: 'Manhã',
    icon: Sun,
    horarios: [
      { id: 1, inicio: '07:00', fim: '08:00', bloco: 'Primeiras aulas' },
      { id: 2, inicio: '08:00', fim: '09:00', bloco: 'Primeiras aulas' },
      { id: 3, inicio: '09:00', fim: '10:00', bloco: 'Segundas aulas' },
      { id: 4, inicio: '10:00', fim: '11:00', bloco: 'Segundas aulas' },
    ],
    fimMap: { '07:00': '08:00', '08:00': '09:00', '09:00': '10:00', '10:00': '11:00' },
    cor: 'amber',
  },
  NOITE: {
    label: 'Noite',
    icon: Moon,
    horarios: [
      { id: 1, inicio: '18:00', fim: '19:00', bloco: 'Primeiras aulas' },
      { id: 2, inicio: '19:00', fim: '20:00', bloco: 'Primeiras aulas' },
      { id: 3, inicio: '20:00', fim: '21:00', bloco: 'Segundas aulas' },
      { id: 4, inicio: '21:00', fim: '22:00', bloco: 'Segundas aulas' },
    ],
    fimMap: { '18:00': '19:00', '19:00': '20:00', '20:00': '21:00', '21:00': '22:00' },
    cor: 'blue',
  },
}

const SIDEBAR_W = 280

export default function Quadro() {
  const [disciplinas, setDisciplinas] = useState([])
  const [quadro, setQuadro] = useState({})
  const [turnoAtivo, setTurnoAtivo] = useState('NOITE')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDraggingOver, setIsDraggingOver] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [periodoRes, horariosRes] = await Promise.all([
        axios.get('/api/periodos/ativo/atual'),
        axios.get('/api/horarios'),
      ])

      if (periodoRes.data?.id) {
        const discRes = await axios.get(`/api/periodos/${periodoRes.data.id}/disciplinas`)
        setDisciplinas(discRes.data || [])
      }

      const quadroTemp = {}
      horariosRes.data?.forEach(h => {
        const key = `${h.turno}-${h.diaSemana}-${h.horarioInicio}`
        quadroTemp[key] = h
      })
      setQuadro(quadroTemp)
    } catch {
      setError('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (e, disciplina) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('disciplinaId', String(disciplina.id))
    e.dataTransfer.setData('disciplinaNome', disciplina.nome)
    e.dataTransfer.setData('professorNome', disciplina.professor)
    e.dataTransfer.setData('sala', disciplina.sala || '')
  }

  const handleDragOver = (e, cellKey) => {
    e.preventDefault()
    setIsDraggingOver(cellKey)
  }

  const handleDragLeave = () => setIsDraggingOver(null)

  const handleDrop = async (e, dia, horarioInicio, turno) => {
    e.preventDefault()
    setIsDraggingOver(null)

    const disciplinaId = e.dataTransfer.getData('disciplinaId')
    if (!disciplinaId) return

    const key = `${turno}-${dia}-${horarioInicio}`
    if (quadro[key]) return

    const sala = e.dataTransfer.getData('sala')
    const horarioFim = turnosConfig[turno].fimMap[horarioInicio]

    try {
      const response = await axios.post('/api/horarios', {
        disciplinaId: parseInt(disciplinaId),
        codigo: `DISC-${Date.now()}`,
        horarioInicio,
        horarioFim,
        diaSemana: dia,
        sala: sala || 'A definir',
        turno,
      })
      setQuadro(prev => ({ ...prev, [key]: response.data }))
    } catch {
      setError('Erro ao adicionar disciplina')
    }
  }

  const handleRemove = async (id, key) => {
    try {
      await axios.delete(`/api/horarios/${id}`)
      setQuadro(prev => { const n = { ...prev }; delete n[key]; return n })
    } catch {
      setError('Erro ao remover disciplina')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-500">Carregando...</div>
      </div>
    )
  }

  const config = turnosConfig[turnoAtivo]
  const cor = config.cor

  return (
    <>
      {/* Área principal com margem direita para não ficar sob o painel fixo */}
      <div className="min-h-screen bg-slate-50 p-8" style={{ marginRight: SIDEBAR_W }}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Quadro de Horários</h1>
          <p className="text-slate-600 mt-1">Arraste as disciplinas do painel lateral para o quadro</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-red-800 text-sm flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Abas */}
        <div className="flex gap-2 mb-5">
          {Object.entries(turnosConfig).map(([turno, cfg]) => {
            const TabIcon = cfg.icon
            const isActive = turnoAtivo === turno
            return (
              <button
                key={turno}
                onClick={() => setTurnoAtivo(turno)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                  isActive
                    ? turno === 'MANHA'
                      ? 'bg-amber-500 text-white shadow'
                      : 'bg-blue-600 text-white shadow'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {cfg.label}
              </button>
            )
          })}
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-36" />
              {diasSemana.map((_, i) => <col key={i} />)}
            </colgroup>
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 text-center text-sm font-semibold text-slate-600">Horário</th>
                {diasSemana.map((dia, i) => (
                  <th key={i} className="px-5 py-4 text-center text-sm font-semibold text-slate-600">{dia}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {config.horarios.map((horario, hIdx) => {
                const isNewBloco = hIdx === 0 || config.horarios[hIdx - 1].bloco !== horario.bloco
                return (
                  <>
                    {isNewBloco && (
                      <tr key={`bloco-${horario.bloco}`}>
                        <td colSpan={6} className="px-5 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-100">
                          {horario.bloco}
                        </td>
                      </tr>
                    )}
                    <tr key={horario.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-5 py-4 bg-slate-50 align-middle">
                        <span className="text-sm font-bold text-slate-700 whitespace-nowrap">
                          {horario.inicio} – {horario.fim}
                        </span>
                      </td>
                      {diasSemana.map((_, diaIdx) => {
                        const key = `${turnoAtivo}-${diaIdx}-${horario.inicio}`
                        const item = quadro[key]
                        const isOver = isDraggingOver === key

                        return (
                          <td
                            key={diaIdx}
                            style={{ height: 160 }}
                            className={`px-3 py-3 border-l border-slate-100 align-stretch transition-colors ${
                              isOver
                                ? cor === 'amber' ? 'bg-amber-50' : 'bg-blue-50'
                                : ''
                            }`}
                            onDragOver={(e) => handleDragOver(e, key)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, diaIdx, horario.inicio, turnoAtivo)}
                          >
                            {item ? (
                              <div className={`relative rounded-xl border h-full p-4 flex flex-col justify-between ${
                                cor === 'amber'
                                  ? 'bg-amber-50 border-amber-200'
                                  : 'bg-blue-50 border-blue-200'
                              }`}>
                                <button
                                  onClick={() => handleRemove(item.id, key)}
                                  className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                <p className={`font-bold text-sm leading-snug pr-5 ${
                                  cor === 'amber' ? 'text-amber-900' : 'text-blue-900'
                                }`}>
                                  {item.disciplinaNome}
                                </p>
                                <div className="space-y-0.5">
                                  <p className={`text-xs font-medium ${
                                    cor === 'amber' ? 'text-amber-600' : 'text-blue-600'
                                  }`}>
                                    {item.professorNome}
                                  </p>
                                  {item.sala && item.sala !== 'A definir' && (
                                    <p className={`text-xs ${
                                      cor === 'amber' ? 'text-amber-500' : 'text-blue-400'
                                    }`}>
                                      {item.sala}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className={`h-full rounded-xl border-2 border-dashed flex items-center justify-center text-xs font-medium transition-colors ${
                                isOver
                                  ? cor === 'amber'
                                    ? 'border-amber-400 text-amber-500 bg-amber-50'
                                    : 'border-blue-400 text-blue-500 bg-blue-50'
                                  : 'border-slate-200 text-slate-300'
                              }`}>
                                Soltar aqui
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Painel fixo na direita da viewport */}
      <div
        className="fixed top-0 right-0 h-screen flex flex-col bg-white border-l border-slate-200 shadow-lg z-30"
        style={{ width: SIDEBAR_W }}
      >
        <div className="px-5 py-5 border-b border-slate-200 bg-slate-50">
          <h2 className="font-bold text-slate-900">Disciplinas</h2>
          <p className="text-xs text-slate-500 mt-1">Arraste para o quadro</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {disciplinas.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-10">Nenhuma disciplina cadastrada</p>
          ) : (
            disciplinas.map((disc) => (
              <div
                key={disc.id}
                draggable
                onDragStart={(e) => handleDragStart(e, disc)}
                className="bg-white border border-slate-200 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-blue-300 hover:shadow-sm transition-all select-none"
              >
                <p className="font-semibold text-slate-900 text-sm leading-snug">{disc.nome}</p>
                <p className="text-slate-500 text-xs mt-1.5">{disc.professor}</p>
                <span className="inline-block mt-2.5 px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                  {disc.cargaHoraria}h
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
