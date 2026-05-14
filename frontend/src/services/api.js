import axios from 'axios'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  }
})

export const periodoAPI = {
  list: () => api.get('/periodos'),
  getById: (id) => api.get(`/periodos/${id}`),
  getActive: () => api.get('/periodos/ativo/atual'),
  create: (data) => api.post('/periodos', data),
  update: (id, data) => api.put(`/periodos/${id}`, data),
  delete: (id) => api.delete(`/periodos/${id}`),
  activate: (id) => api.patch(`/periodos/${id}/ativar`),
}

export const disciplinaAPI = {
  listByPeriodo: (periodoId) => api.get(`/periodos/${periodoId}/disciplinas`),
  getById: (id) => api.get(`/periodos/disciplinas/${id}`),
  create: (periodoId, data) => api.post(`/periodos/${periodoId}/disciplinas`, data),
  update: (id, data) => api.put(`/periodos/disciplinas/${id}`, data),
  delete: (id) => api.delete(`/periodos/disciplinas/${id}`),
}

export const aulaAPI = {
  listByDisciplina: (disciplinaId) => api.get(`/disciplinas/${disciplinaId}/aulas`),
  getById: (id) => api.get(`/disciplinas/aulas/${id}`),
  create: (disciplinaId, data) => api.post(`/disciplinas/${disciplinaId}/aulas`, data),
  update: (id, data) => api.put(`/disciplinas/aulas/${id}`, data),
  delete: (id) => api.delete(`/disciplinas/aulas/${id}`),
}

export const atividadeAPI = {
  listByAula: (aulaId) => api.get(`/aulas/${aulaId}/atividades`),
  listPending: () => api.get('/aulas/atividades/pendentes'),
  getById: (id) => api.get(`/aulas/atividades/${id}`),
  create: (aulaId, data) => api.post(`/aulas/${aulaId}/atividades`, data),
  update: (id, data) => api.put(`/aulas/atividades/${id}`, data),
  markComplete: (id) => api.patch(`/aulas/atividades/${id}/concluir`),
  delete: (id) => api.delete(`/aulas/atividades/${id}`),
}

export default api
