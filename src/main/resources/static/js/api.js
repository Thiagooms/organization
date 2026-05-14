const API_BASE = '/api';

const showAlert = (message, type = 'success') => {
    const alertDiv = document.querySelector('.alert');
    if (alertDiv) {
        alertDiv.textContent = message;
        alertDiv.className = `alert ${type} show`;
        setTimeout(() => alertDiv.classList.remove('show'), 4000);
    }
};

const handleError = (error) => {
    console.error('Erro:', error);
    showAlert(error.message || 'Ocorreu um erro', 'error');
};

const fetchWithErrorHandling = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro na requisição' }));
            throw new Error(errorData.message || `Erro ${response.status}`);
        }
        return response.status === 204 ? null : await response.json();
    } catch (error) {
        handleError(error);
        throw error;
    }
};

const periodo = {
    listar: () => fetchWithErrorHandling(`${API_BASE}/periodos`),
    obterPorId: (id) => fetchWithErrorHandling(`${API_BASE}/periodos/${id}`),
    obterAtivo: () => fetchWithErrorHandling(`${API_BASE}/periodos/ativo/atual`),
    criar: (data) => fetchWithErrorHandling(`${API_BASE}/periodos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    atualizar: (id, data) => fetchWithErrorHandling(`${API_BASE}/periodos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    deletar: (id) => fetchWithErrorHandling(`${API_BASE}/periodos/${id}`, { method: 'DELETE' }),
    ativar: (id) => fetchWithErrorHandling(`${API_BASE}/periodos/${id}/ativar`, { method: 'PATCH' })
};

const disciplina = {
    listarPorPeriodo: (periodoId) => fetchWithErrorHandling(`${API_BASE}/periodos/${periodoId}/disciplinas`),
    obterPorId: (id) => fetchWithErrorHandling(`${API_BASE}/periodos/disciplinas/${id}`),
    criar: (periodoId, data) => fetchWithErrorHandling(`${API_BASE}/periodos/${periodoId}/disciplinas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    atualizar: (id, data) => fetchWithErrorHandling(`${API_BASE}/periodos/disciplinas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    deletar: (id) => fetchWithErrorHandling(`${API_BASE}/periodos/disciplinas/${id}`, { method: 'DELETE' })
};

const aula = {
    listarPorDisciplina: (disciplinaId) => fetchWithErrorHandling(`${API_BASE}/disciplinas/${disciplinaId}/aulas`),
    obterPorId: (id) => fetchWithErrorHandling(`${API_BASE}/disciplinas/aulas/${id}`),
    criar: (disciplinaId, data) => fetchWithErrorHandling(`${API_BASE}/disciplinas/${disciplinaId}/aulas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    atualizar: (id, data) => fetchWithErrorHandling(`${API_BASE}/disciplinas/aulas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    deletar: (id) => fetchWithErrorHandling(`${API_BASE}/disciplinas/aulas/${id}`, { method: 'DELETE' })
};

const atividade = {
    listarPorAula: (aulaId) => fetchWithErrorHandling(`${API_BASE}/aulas/${aulaId}/atividades`),
    listarPendentes: () => fetchWithErrorHandling(`${API_BASE}/aulas/atividades/pendentes`),
    obterPorId: (id) => fetchWithErrorHandling(`${API_BASE}/aulas/atividades/${id}`),
    criar: (aulaId, data) => fetchWithErrorHandling(`${API_BASE}/aulas/${aulaId}/atividades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    atualizar: (id, data) => fetchWithErrorHandling(`${API_BASE}/aulas/atividades/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    marcarConcluida: (id) => fetchWithErrorHandling(`${API_BASE}/aulas/atividades/${id}/concluir`, { method: 'PATCH' }),
    deletar: (id) => fetchWithErrorHandling(`${API_BASE}/aulas/atividades/${id}`, { method: 'DELETE' })
};

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    if (nav) {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = nav.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
});
