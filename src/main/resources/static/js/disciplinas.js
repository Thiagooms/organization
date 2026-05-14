let periodoAtivoId = null;
let disciplinas = [];
let editandoId = null;

const carregarPeriodoAtivo = async () => {
    try {
        const periodoData = await periodo.obterAtivo();
        periodoAtivoId = periodoData.id;
        document.getElementById('periodoAtivo').textContent = periodoData.nome;
        await carregarDisciplinas();
    } catch (error) {
        document.getElementById('periodoAtivo').textContent = 'Nenhum período ativo';
        document.getElementById('listaDisciplinas').innerHTML =
            '<div class="empty-state"><p>Nenhum período ativo. Crie um em <a href="periodos.html">Períodos</a>.</p></div>';
    }
};

const carregarDisciplinas = async () => {
    if (!periodoAtivoId) return;
    try {
        disciplinas = await disciplina.listarPorPeriodo(periodoAtivoId);
        renderizarDisciplinas();
    } catch (error) {
        console.error('Erro ao carregar disciplinas:', error);
    }
};

const renderizarDisciplinas = () => {
    const container = document.getElementById('listaDisciplinas');
    if (disciplinas.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Nenhuma disciplina cadastrada.</p></div>';
        return;
    }

    container.innerHTML = disciplinas.map(d => `
        <div class="list-item">
            <div class="list-item-info">
                <h3>${d.nome}</h3>
                <p>Professor: ${d.professor}</p>
                <p>Carga Horária: ${d.cargaHoraria}h</p>
                <a href="aulas.html?disciplinaId=${d.id}">Ver aulas →</a>
            </div>
            <div class="list-item-actions">
                <button onclick="editarDisciplina(${d.id})">Editar</button>
                <button class="danger" onclick="deletarDisciplina(${d.id})">Deletar</button>
            </div>
        </div>
    `).join('');
};

const abrirFormulario = () => {
    if (!periodoAtivoId) {
        showAlert('Ative um período primeiro', 'error');
        return;
    }
    editandoId = null;
    document.getElementById('disciplinaForm').reset();
    document.getElementById('formTitulo').textContent = 'Nova Disciplina';
    document.getElementById('disciplinaModal').classList.add('show');
};

const fecharFormulario = () => {
    document.getElementById('disciplinaModal').classList.remove('show');
};

const salvarDisciplina = async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const professor = document.getElementById('professor').value;
    const cargaHoraria = parseInt(document.getElementById('cargaHoraria').value);

    const data = { nome, professor, cargaHoraria };

    try {
        if (editandoId) {
            await disciplina.atualizar(editandoId, data);
            showAlert('Disciplina atualizada com sucesso!', 'success');
        } else {
            await disciplina.criar(periodoAtivoId, data);
            showAlert('Disciplina criada com sucesso!', 'success');
        }
        fecharFormulario();
        await carregarDisciplinas();
    } catch (error) {
        console.error('Erro ao salvar disciplina:', error);
    }
};

const editarDisciplina = async (id) => {
    try {
        const d = await disciplina.obterPorId(id);
        editandoId = id;
        document.getElementById('nome').value = d.nome;
        document.getElementById('professor').value = d.professor;
        document.getElementById('cargaHoraria').value = d.cargaHoraria;
        document.getElementById('formTitulo').textContent = 'Editar Disciplina';
        document.getElementById('disciplinaModal').classList.add('show');
    } catch (error) {
        console.error('Erro ao carregar disciplina:', error);
    }
};

const deletarDisciplina = async (id) => {
    if (confirm('Tem certeza que deseja deletar esta disciplina?')) {
        try {
            await disciplina.deletar(id);
            showAlert('Disciplina deletada com sucesso!', 'success');
            await carregarDisciplinas();
        } catch (error) {
            console.error('Erro ao deletar disciplina:', error);
        }
    }
};

document.addEventListener('DOMContentLoaded', carregarPeriodoAtivo);
