import { useEffect, useState } from 'react'
import { GripVertical, GraduationCap } from 'lucide-react'
import { periodoAPI, disciplinaAPI, aulaAPI, atividadeAPI, monitoriaAPI } from '../services/api'

const STORAGE_KEY = 'kanban-priority-v2'

const COLUMNS = [
  {
    key: 'urgente',
    label: 'Urgente',
    headerClass: 'bg-red-600 text-white',
    bodyClass: 'bg-red-50 border-red-200',
    countClass: 'bg-red-700 text-white',
    ringClass: 'ring-2 ring-red-400',
  },
  {
    key: 'alta',
    label: 'Alta',
    headerClass: 'bg-orange-500 text-white',
    bodyClass: 'bg-orange-50 border-orange-200',
    countClass: 'bg-orange-600 text-white',
    ringClass: 'ring-2 ring-orange-400',
  },
  {
    key: 'media',
    label: 'Média',
    headerClass: 'bg-amber-400 text-amber-900',
    bodyClass: 'bg-amber-50 border-amber-200',
    countClass: 'bg-amber-500 text-white',
    ringClass: 'ring-2 ring-amber-400',
  },
  {
    key: 'baixa',
    label: 'Baixa',
    headerClass: 'bg-slate-400 text-white',
    bodyClass: 'bg-slate-50 border-slate-200',
    countClass: 'bg-slate-500 text-white',
    ringClass: 'ring-2 ring-slate-400',
  },
]

const diffDays = (dateStr) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [y, m, d] = dateStr.split('-').map(Number)
  return Math.ceil((new Date(y, m - 1, d) - today) / 86400000)
}

const getDefaultColByDate = (dateStr) => {
  const d = diffDays(dateStr)
  if (d <= 2) return 'urgente'
  if (d <= 5) return 'alta'
  if (d <= 10) return 'media'
  return 'baixa'
}

const getDeadlineBadge = (dateStr) => {
  const d = diffDays(dateStr)
  if (d < 0) return { label: 'Expirado', cls: 'bg-slate-800 text-slate-100' }
  if (d === 0) return { label: 'Vence hoje!', cls: 'bg-red-600 text-white' }
  if (d <= 2) return { label: `${d}d restantes`, cls: 'bg-red-100 text-red-700' }
  if (d <= 5) return { label: `${d}d restantes`, cls: 'bg-orange-100 text-orange-700' }
  if (d <= 10) return { label: `${d}d restantes`, cls: 'bg-amber-100 text-amber-700' }
  return { label: `${d}d restantes`, cls: 'bg-slate-100 text-slate-600' }
}

const getTipoBadge = (tipo) => {
  const map = {
    ATIVIDADE: { cls: 'bg-amber-100 text-amber-700', label: 'Atividade' },
    PROVA: { cls: 'bg-red-100 text-red-700', label: 'Prova' },
    TRABALHO: { cls: 'bg-green-100 text-green-700', label: 'Trabalho' },
  }
  return map[tipo] || { cls: 'bg-slate-100 text-slate-700', label: tipo }
}

const STATUS_MONITORIA = {
  AGUARDANDO_PROVA: { label: 'Aguardando Prova', cls: 'bg-amber-100 text-amber-700' },
  ATIVO: { label: 'Ativo', cls: 'bg-green-100 text-green-700' },
}

const TIPO_MONITORIA = {
  PARTICIPANDO: 'Participando',
  SENDO_MONITOR: 'Monitor',
}

export default function Prioridade() {
  const [itemMap, setItemMap] = useState({})
  const [columns, setColumns] = useState({ urgente: [], alta: [], media: [], baixa: [] })
  const [loading, setLoading] = useState(true)
  const [dragging, setDragging] = useState(null)
  const [dragOverCol, setDragOverCol] = useState(null)
  const [dragOverCard, setDragOverCard] = useState(null)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const newItemMap = {}

      // --- Atividades pendentes do período ativo ---
      const periodoRes = await periodoAPI.getActive().catch(() => null)
      if (periodoRes?.data?.id) {
        const discRes = await disciplinaAPI.listByPeriodo(periodoRes.data.id)
        for (const disc of discRes.data) {
          const aulasRes = await aulaAPI.listByDisciplina(disc.id)
          for (const aula of aulasRes.data) {
            const atvsRes = await atividadeAPI.listByAula(aula.id)
            for (const atv of atvsRes.data) {
              if (!atv.concluida) {
                newItemMap[`a-${atv.id}`] = {
                  ...atv,
                  itemType: 'atividade',
                  disciplinaNome: disc.nome,
                }
              }
            }
          }
        }
      }

      // --- Monitorias ativas ou aguardando prova ---
      const monRes = await monitoriaAPI.list().catch(() => ({ data: [] }))
      for (const mon of monRes.data) {
        if (mon.status !== 'INATIVO') {
          newItemMap[`m-${mon.id}`] = { ...mon, itemType: 'monitoria' }
        }
      }

      setItemMap(newItemMap)

      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      const allKeys = new Set(Object.keys(newItemMap))
      const newCols = { urgente: [], alta: [], media: [], baixa: [] }
      const placed = new Set()

      for (const col of Object.keys(newCols)) {
        if (saved[col]) {
          newCols[col] = saved[col].filter((k) => allKeys.has(k))
          newCols[col].forEach((k) => placed.add(k))
        }
      }

      for (const [key, item] of Object.entries(newItemMap)) {
        if (placed.has(key)) continue
        if (item.itemType === 'atividade') {
          newCols[getDefaultColByDate(item.dataEntrega)].push(key)
        } else {
          const col = item.dataProva
            ? getDefaultColByDate(item.dataProva)
            : item.status === 'AGUARDANDO_PROVA' ? 'alta' : 'baixa'
          newCols[col].push(key)
        }
      }

      setColumns(newCols)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const persist = (cols) => localStorage.setItem(STORAGE_KEY, JSON.stringify(cols))

  const onCardDragStart = (e, key, fromCol) => {
    setDragging({ id: key, fromCol })
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', key)
  }

  const onCardDragOver = (e, key) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const position = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after'
    setDragOverCard((prev) =>
      prev?.id === key && prev?.position === position ? prev : { id: key, position }
    )
  }

  const onColDragOver = (e, colKey) => {
    e.preventDefault()
    setDragOverCol(colKey)
    setDragOverCard(null)
  }

  const onColDrop = (e, toCol) => {
    e.preventDefault()
    if (!dragging) return

    const { id: key, fromCol } = dragging
    const newCols = {
      urgente: [...columns.urgente],
      alta: [...columns.alta],
      media: [...columns.media],
      baixa: [...columns.baixa],
    }

    newCols[fromCol] = newCols[fromCol].filter((k) => k !== key)

    if (dragOverCard && newCols[toCol].includes(dragOverCard.id)) {
      const idx = newCols[toCol].indexOf(dragOverCard.id)
      const insertAt = dragOverCard.position === 'before' ? idx : idx + 1
      newCols[toCol].splice(insertAt, 0, key)
    } else {
      newCols[toCol].push(key)
    }

    setColumns(newCols)
    persist(newCols)
    setDragging(null)
    setDragOverCol(null)
    setDragOverCard(null)
  }

  const onDragEnd = () => {
    setDragging(null)
    setDragOverCol(null)
    setDragOverCard(null)
  }

  const total = Object.keys(itemMap).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="p-6 flex flex-col gap-6 h-full">
      <div className="flex items-start gap-4">
        <div className="w-1 h-12 rounded-full bg-red-500 flex-shrink-0 mt-1" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Prioridade</h1>
          <p className="text-slate-600 mt-1">
            {total === 0 ? 'Nada pendente' : `${total} item${total !== 1 ? 's' : ''} pendente${total !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {total === 0 ? (
        <div className="bg-slate-100 rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-slate-600">Nenhuma atividade ou monitoria pendente</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-1 min-h-0">
          {COLUMNS.map((col) => {
            const isOver = dragOverCol === col.key && !!dragging

            return (
              <div
                key={col.key}
                className={`flex flex-col rounded-xl border overflow-hidden transition-shadow ${col.bodyClass} ${isOver ? `shadow-lg ${col.ringClass}` : ''}`}
                onDragOver={(e) => onColDragOver(e, col.key)}
                onDrop={(e) => onColDrop(e, col.key)}
              >
                <div className={`px-4 py-3 flex items-center justify-between flex-shrink-0 ${col.headerClass}`}>
                  <span className="font-semibold text-sm">{col.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${col.countClass}`}>
                    {columns[col.key].length}
                  </span>
                </div>

                <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                  {columns[col.key].length === 0 && !isOver && (
                    <p className="text-xs text-slate-400 text-center pt-6 select-none">
                      Arraste itens aqui
                    </p>
                  )}

                  {columns[col.key].map((key) => {
                    const item = itemMap[key]
                    if (!item) return null

                    const isDraggingThis = dragging?.id === key
                    const showBefore = dragOverCard?.id === key && dragOverCard?.position === 'before' && !isDraggingThis
                    const showAfter = dragOverCard?.id === key && dragOverCard?.position === 'after' && !isDraggingThis

                    return (
                      <div key={key}>
                        {showBefore && <div className="h-0.5 rounded-full bg-blue-500 mx-1" />}

                        <div
                          draggable
                          onDragStart={(e) => onCardDragStart(e, key, col.key)}
                          onDragEnd={onDragEnd}
                          onDragOver={(e) => onCardDragOver(e, key)}
                          className={`bg-white rounded-lg border p-3 shadow-sm transition-all select-none cursor-grab active:cursor-grabbing border-l-4 ${
                            item.itemType === 'monitoria'
                              ? 'border-slate-200 border-l-purple-500'
                              : 'border-slate-200 border-l-slate-300'
                          } ${isDraggingThis ? 'opacity-30' : 'opacity-100 hover:shadow-md'}`}
                        >
                          <div className="flex items-start gap-2">
                            <GripVertical className="w-3.5 h-3.5 text-slate-300 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              {item.itemType === 'atividade' ? (
                                <AtividadeCardContent item={item} />
                              ) : (
                                <MonitoriaCardContent item={item} />
                              )}
                            </div>
                          </div>
                        </div>

                        {showAfter && <div className="h-0.5 rounded-full bg-blue-500 mx-1" />}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function AtividadeCardContent({ item }) {
  const badge = getDeadlineBadge(item.dataEntrega)
  const tipo = getTipoBadge(item.tipo)

  return (
    <>
      <p className="font-semibold text-slate-900 text-sm leading-snug mb-2 break-words">{item.titulo}</p>
      <div className="flex flex-wrap gap-1 mb-2">
        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${tipo.cls}`}>{tipo.label}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${badge.cls}`}>{badge.label}</span>
      </div>
      <p className="text-xs text-slate-500 truncate font-medium">{item.disciplinaNome}</p>
      <p className="text-xs text-slate-400 mt-0.5">
        Entrega: {new Date(item.dataEntrega + 'T00:00:00').toLocaleDateString('pt-BR')}
      </p>
    </>
  )
}

function MonitoriaCardContent({ item }) {
  const statusCfg = STATUS_MONITORIA[item.status] || { label: item.status, cls: 'bg-slate-100 text-slate-600' }
  const tipoLabel = TIPO_MONITORIA[item.tipo] || item.tipo

  return (
    <>
      <div className="flex items-center gap-1 mb-1.5">
        <GraduationCap className="w-3 h-3 text-purple-500 flex-shrink-0" />
        <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Monitoria</span>
      </div>
      <p className="font-semibold text-slate-900 text-sm leading-snug mb-2 break-words">{item.disciplina}</p>
      <div className="flex flex-wrap gap-1 mb-2">
        <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-purple-100 text-purple-700">
          {tipoLabel}
        </span>
        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${statusCfg.cls}`}>
          {statusCfg.label}
        </span>
        {item.dataProva && (
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${getDeadlineBadge(item.dataProva).cls}`}>
            {getDeadlineBadge(item.dataProva).label}
          </span>
        )}
      </div>
      {item.professor && (
        <p className="text-xs text-slate-500 truncate">Prof. {item.professor}</p>
      )}
      {item.dataProva && (
        <p className="text-xs text-slate-400 mt-0.5">
          Prova: {new Date(item.dataProva + 'T00:00:00').toLocaleDateString('pt-BR')}
        </p>
      )}
    </>
  )
}
