let periodoAtivoId = null;
let disciplinas = [];
let aulasPorDisciplina = {};
let atividadesPorAula = {};
let editandoId = null;

const carregarPeriodoAtivo = async () => {
    try {
        const periodoData = await periodo.obterAtivo();
        periodoAtivoId = periodoData.id;
        document.getElementById('periodoNome').textContent = periodoData.nome;
        document.getElementById('noPeriodo').style.display = 'none';
        document.getElementById('atividadesContainer').style.display = 'block';
        await carregarDados();
    } catch (error) {
        document.getElementById('noPeriodo').style.display = 'block';
        document.getElementById('atividadesContainer').style.display = 'none';
    }
};

const carregarDados = async () => {
    if (!periodoAtivoId) return;
    try {
        disciplinas = await disciplina.listarPorPeriodo(periodoAtivoId);
        await carregarTodasAsAulas();
        await carregarTodasAsAtividades();
        renderizarEstrutura();
        preencherSelectDisciplinas();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
};

const carregarTodasAsAulas = async () => {
    aulasPorDisciplina = {};
    for (const disc of disciplinas) {
        try {
            aulasPorDisciplina[disc.id] = await aula.listarPorDisciplina(disc.id);
        } catch (error) {
            aulasPorDisciplina[disc.id] = [];
        }
    }
};

const carregarTodasAsAtividades = async () => {
    atividadesPorAula = {};
    for (const discId in aulasPorDisciplina) {
        for (const aulaItem of aulasPorDisciplina[discId]) {
            try {
                atividadesPorAula[aulaItem.id] = await atividade.listarPorAula(aulaItem.id);
            } catch (error) {
                atividadesPorAula[aulaItem.id] = [];
            }
        }
    }
};

const renderizarEstrutura = () => {
    const container = document.getElementById('atividadesContainer');

    if (disciplinas.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Nenhuma disciplina cadastrada.</p></div>';
        return;
    }

    container.innerHTML = disciplinas.map(disc => {
        const aulas = aulasPorDisciplina[disc.id] || [];
        if (aulas.length === 0) {
            return `
                <div class="disciplina-section">
                    <div class="disciplina-title" onclick="toggleDisciplina(this)">${disc.nome}</div>
                    <div class="empty-state" style="padding: 20px; text-align: center; color: #7f8c8d;">
                        <p>Nenhuma aula registrada nesta disciplina.</p>
                    </div>
                </div>
            `;
        }

        return `
            <div class="disciplina-section">
                <div class="disciplina-title" onclick="toggleDisciplina(this)">${disc.nome}</div>
                <div class="aulas-list show" id="disc-${disc.id}">
                    ${aulas.map(aulaItem => renderizarAulaComAtividades(aulaItem)).join('')}
                </div>
            </div>
        `;
    }).join('');
};

const renderizarAulaComAtividades = (aulaItem) => {
    const atividades = atividadesPorAula[aulaItem.id] || [];
    return `
        <div class="aula-group">
            <h4 onclick="toggleAtividades(event)">
                <span>${new Date(aulaItem.data).toLocaleDateString('pt-BR')} - ${aulaItem.conteudo ? aulaItem.conteudo.substring(0, 30) : 'Sem conteúdo'}</span>
                <span>▼</span>
            </h4>
            <div class="atividades-list show" id="aula-${aulaItem.id}">
                ${atividades.length === 0
                    ? '<p style="color: #7f8c8d; font-size: 13px; margin: 5px 0;">Nenhuma atividade registrada.</p>'
                    : atividades.map(at => `
                        <div class="atividade-item ${at.concluida ? 'concluida' : ''}">
                            <div class="atividade-info">
                                <h5>${at.titulo}</h5>
                                <p>Tipo: ${at.tipo} | Entrega: ${new Date(at.dataEntrega).toLocaleDateString('pt-BR')}</p>
                                ${at.nota ? `<p>Nota: ${at.nota}</p>` : ''}
                                ${at.concluida ? '<p style="color: #27ae60;">✓ Concluída</p>' : ''}
                            </div>
                            <div class="atividade-actions">
                                ${!at.concluida ? `<button class="success" onclick="marcarConcluida(${at.id})">Concluir</button>` : ''}
                                <button onclick="editarAtividade(${at.id})">Editar</button>
                                <button class="danger" onclick="deletarAtividade(${at.id})">Deletar</button>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `;
};

const toggleDisciplina = (element) => {
    const list = element.nextElementSibling;
    if (list && list.classList.contains('aulas-list')) {
        list.classList.toggle('show');
    }
};

const toggleAtividades = (event) => {
    event.stopPropagation();
    const parent = event.target.closest('h4').parentElement;
    const list = parent.querySelector('.atividades-list');
    if (list) {
        list.classList.toggle('show');
    }
};

const preencherSelectDisciplinas = () => {
    const select = document.getElementById('disciplinaSelect');
    select.innerHTML = '<option value="">Selecione uma disciplina...</option>' +
        disciplinas.map(d => `<option value="${d.id}">${d.nome}</option>`).join('');
};

const abrirFormulario = () => {
    if (disciplinas.length === 0) {
        showAlert('Cadastre uma disciplina primeiro', 'error');
        return;
    }
    editandoId = null;
    document.getElementById('atividadeForm').reset();
    document.getElementById('formTitulo').textContent = 'Nova Atividade';
    document.getElementById('atividadeModal').classList.add('show');
};

const fecharFormulario = () => {
    document.getElementById('atividadeModal').classList.remove('show');
};

document.getElementById('disciplinaSelect')?.addEventListener('change', async (e) => {
    const disciplinaId = e.target.value;
    const aulaSelect = document.getElementById('aulaSelect');

    if (!disciplinaId) {
        aulaSelect.innerHTML = '<option value="">Selecione uma disciplina primeiro...</option>';
        return;
    }

    const aulas = aulasPorDisciplina[disciplinaId] || [];
    aulaSelect.innerHTML = '<option value="">Selecione uma aula...</option>' +
        aulas.map(a => `<option value="${a.id}">${new Date(a.data).toLocaleDateString('pt-BR')} - ${a.conteudo || 'Sem conteúdo'}</option>`).join('');
});

const salvarAtividade = async (e) => {
    e.preventDefault();
    const aulaId = document.getElementById('aulaSelect').value;
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const dataEntrega = document.getElementById('dataEntrega').value;
    const tipo = document.getElementById('tipo').value;
    const nota = document.getElementById('nota').value ? parseFloat(document.getElementById('nota').value) : null;

    if (!aulaId) {
        showAlert('Selecione uma aula', 'error');
        return;
    }

    const atividadeData = { titulo, descricao, dataEntrega, tipo, nota };

    try {
        if (editandoId) {
            await atividade.atualizar(editandoId, atividadeData);
            showAlert('Atividade atualizada com sucesso!', 'success');
        } else {
            await atividade.criar(aulaId, atividadeData);
            showAlert('Atividade criada com sucesso!', 'success');
        }
        fecharFormulario();
        await carregarTodasAsAtividades();
        renderizarEstrutura();
    } catch (error) {
        console.error('Erro ao salvar atividade:', error);
    }
};

const editarAtividade = async (id) => {
    try {
        const at = await atividade.obterPorId(id);
        editandoId = id;
        document.getElementById('disciplinaSelect').value = '';
        document.getElementById('aulaSelect').value = at.aulaId;
        document.getElementById('titulo').value = at.titulo;
        document.getElementById('descricao').value = at.descricao || '';
        document.getElementById('dataEntrega').value = at.dataEntrega;
        document.getElementById('tipo').value = at.tipo;
        document.getElementById('nota').value = at.nota || '';
        document.getElementById('formTitulo').textContent = 'Editar Atividade';
        document.getElementById('atividadeModal').classList.add('show');
    } catch (error) {
        console.error('Erro ao carregar atividade:', error);
    }
};

const marcarConcluida = async (id) => {
    try {
        await atividade.marcarConcluida(id);
        showAlert('Atividade marcada como concluída!', 'success');
        await carregarTodasAsAtividades();
        renderizarEstrutura();
    } catch (error) {
        console.error('Erro ao marcar atividade:', error);
    }
};

const deletarAtividade = async (id) => {
    if (confirm('Tem certeza que deseja deletar esta atividade?')) {
        try {
            await atividade.deletar(id);
            showAlert('Atividade deletada com sucesso!', 'success');
            await carregarTodasAsAtividades();
            renderizarEstrutura();
        } catch (error) {
            console.error('Erro ao deletar atividade:', error);
        }
    }
};

document.addEventListener('DOMContentLoaded', carregarPeriodoAtivo);
