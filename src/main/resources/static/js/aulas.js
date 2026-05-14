let periodoAtivoId = null;
let disciplinas = [];
let aulasPorDisciplina = {};
let editandoId = null;
let disciplinaEmEdicao = null;

const carregarPeriodoAtivo = async () => {
    try {
        const periodoData = await periodo.obterAtivo();
        periodoAtivoId = periodoData.id;
        document.getElementById('periodoNome').textContent = periodoData.nome;
        document.getElementById('noPeriodo').style.display = 'none';
        document.getElementById('disciplinasContainer').style.display = 'block';
        await carregarDisciplinas();
    } catch (error) {
        document.getElementById('noPeriodo').style.display = 'block';
        document.getElementById('disciplinasContainer').style.display = 'none';
    }
};

const carregarDisciplinas = async () => {
    if (!periodoAtivoId) return;
    try {
        disciplinas = await disciplina.listarPorPeriodo(periodoAtivoId);
        await carregarTodasAsAulas();
        renderizarAbas();
        preencherSelectDisciplinas();
    } catch (error) {
        console.error('Erro ao carregar disciplinas:', error);
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

const renderizarAbas = () => {
    const tabsContainer = document.getElementById('tabs');
    const contentContainer = document.getElementById('tabContent');

    if (disciplinas.length === 0) {
        contentContainer.innerHTML = '<div class="empty-state"><p>Nenhuma disciplina cadastrada.</p></div>';
        return;
    }

    tabsContainer.innerHTML = disciplinas.map(d => `
        <button class="tab-btn ${disciplinas.indexOf(d) === 0 ? 'active' : ''}" onclick="selecionarDisciplina(${d.id})">
            ${d.nome}
        </button>
    `).join('');

    contentContainer.innerHTML = disciplinas.map(d => `
        <div class="tab-content ${disciplinas.indexOf(d) === 0 ? 'active' : ''}" id="tab-${d.id}">
            ${renderizarAulasDisciplina(d.id)}
        </div>
    `).join('');
};

const renderizarAulasDisciplina = (discId) => {
    const aulas = aulasPorDisciplina[discId] || [];
    if (aulas.length === 0) {
        return '<div class="empty-state"><p>Nenhuma aula registrada nesta disciplina.</p></div>';
    }

    return aulas.map(a => `
        <div class="aula-item">
            <div class="aula-header" onclick="toggleAulaDetails(${a.id})">
                <h3>${new Date(a.data).toLocaleDateString('pt-BR')} - ${a.conteudo ? a.conteudo.substring(0, 40) + '...' : 'Sem conteúdo'}</h3>
                <div>
                    <span style="color: #3498db; margin-right: 10px;">😊 ${a.satisfacao}/5 | 📊 ${a.dificuldade}/5</span>
                    <span style="color: #7f8c8d;">▼</span>
                </div>
            </div>
            <div class="aula-details" id="details-${a.id}">
                <div class="aula-detail-row">
                    <strong>Conteúdo:</strong>
                    <p>${a.conteudo || 'Não informado'}</p>
                </div>
                <div class="aula-detail-row">
                    <strong>Dúvidas:</strong>
                    <p>${a.duvidas || 'Nenhuma dúvida registrada'}</p>
                </div>
                <div class="aula-detail-row">
                    <strong>Observações:</strong>
                    <p>${a.observacoes || 'Nenhuma observação'}</p>
                </div>
                <div class="aula-actions">
                    <button onclick="editarAula(${a.id})">Editar</button>
                    <button class="danger" onclick="deletarAula(${a.id})">Deletar</button>
                    <a href="atividades.html?aulaId=${a.id}" style="padding: 6px 12px; background: #27ae60; color: white; border-radius: 4px; text-decoration: none; font-size: 12px;">Ver Atividades</a>
                </div>
            </div>
        </div>
    `).join('');
};

const selecionarDisciplina = (discId) => {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    event.target.classList.add('active');
    document.getElementById(`tab-${discId}`).classList.add('active');
};

const toggleAulaDetails = (aulaId) => {
    const details = document.getElementById(`details-${aulaId}`);
    details.classList.toggle('show');
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
    disciplinaEmEdicao = null;
    document.getElementById('aulaForm').reset();
    document.getElementById('formTitulo').textContent = 'Nova Aula';
    document.getElementById('aulaModal').classList.add('show');
};

const fecharFormulario = () => {
    document.getElementById('aulaModal').classList.remove('show');
};

const salvarAula = async (e) => {
    e.preventDefault();
    const disciplinaId = document.getElementById('disciplinaSelect').value;
    const data = document.getElementById('data').value;
    const conteudo = document.getElementById('conteudo').value;
    const satisfacao = parseInt(document.getElementById('satisfacao').value);
    const dificuldade = parseInt(document.getElementById('dificuldade').value);
    const duvidas = document.getElementById('duvidas').value;
    const observacoes = document.getElementById('observacoes').value;

    if (!disciplinaId) {
        showAlert('Selecione uma disciplina', 'error');
        return;
    }

    const aulaData = { data, conteudo, satisfacao, dificuldade, duvidas, observacoes };

    try {
        if (editandoId) {
            await aula.atualizar(editandoId, aulaData);
            showAlert('Aula atualizada com sucesso!', 'success');
        } else {
            await aula.criar(disciplinaId, aulaData);
            showAlert('Aula registrada com sucesso!', 'success');
        }
        fecharFormulario();
        await carregarTodasAsAulas();
        renderizarAbas();
    } catch (error) {
        console.error('Erro ao salvar aula:', error);
    }
};

const editarAula = async (id) => {
    try {
        const a = await aula.obterPorId(id);
        editandoId = id;
        disciplinaEmEdicao = a.disciplinaId;
        document.getElementById('disciplinaSelect').value = a.disciplinaId;
        document.getElementById('data').value = a.data;
        document.getElementById('conteudo').value = a.conteudo || '';
        document.getElementById('satisfacao').value = a.satisfacao;
        document.getElementById('dificuldade').value = a.dificuldade;
        document.getElementById('duvidas').value = a.duvidas || '';
        document.getElementById('observacoes').value = a.observacoes || '';
        document.getElementById('formTitulo').textContent = 'Editar Aula';
        document.getElementById('aulaModal').classList.add('show');
    } catch (error) {
        console.error('Erro ao carregar aula:', error);
    }
};

const deletarAula = async (id) => {
    if (confirm('Tem certeza que deseja deletar esta aula?')) {
        try {
            await aula.deletar(id);
            showAlert('Aula deletada com sucesso!', 'success');
            await carregarTodasAsAulas();
            renderizarAbas();
        } catch (error) {
            console.error('Erro ao deletar aula:', error);
        }
    }
};

document.addEventListener('DOMContentLoaded', carregarPeriodoAtivo);
