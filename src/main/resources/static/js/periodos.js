let periodos = [];
let editandoId = null;

const carregarPeriodos = async () => {
    try {
        periodos = await periodo.listar();
        renderizarPeriodos();
    } catch (error) {
        console.error('Erro ao carregar períodos:', error);
    }
};

const renderizarPeriodos = () => {
    const container = document.getElementById('listaPeriodos');
    if (periodos.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Nenhum período cadastrado.</p></div>';
        return;
    }

    container.innerHTML = periodos.map(p => `
        <div class="list-item ${p.ativo ? 'ativo' : ''}">
            <div class="list-item-info">
                <h3>${p.nome}</h3>
                <p>Início: ${new Date(p.dataInicio).toLocaleDateString('pt-BR')}</p>
                <p>Fim: ${new Date(p.dataFim).toLocaleDateString('pt-BR')}</p>
            </div>
            <div class="list-item-actions">
                ${p.ativo ? '<span class="badge ativo">Ativo</span>' : ''}
                ${!p.ativo ? `<button class="success" onclick="ativarPeriodo(${p.id})">Ativar</button>` : ''}
                <button onclick="editarPeriodo(${p.id})">Editar</button>
                <button class="danger" onclick="deletarPeriodo(${p.id})">Deletar</button>
            </div>
        </div>
    `).join('');
};

const abrirFormulario = () => {
    editandoId = null;
    document.getElementById('periodoForm').reset();
    document.getElementById('formTitulo').textContent = 'Novo Período';
    document.getElementById('periodoModal').classList.add('show');
};

const fecharFormulario = () => {
    document.getElementById('periodoModal').classList.remove('show');
};

const salvarPeriodo = async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;

    const data = { nome, dataInicio, dataFim };

    try {
        if (editandoId) {
            await periodo.atualizar(editandoId, data);
            showAlert('Período atualizado com sucesso!', 'success');
        } else {
            await periodo.criar(data);
            showAlert('Período criado com sucesso!', 'success');
        }
        fecharFormulario();
        await carregarPeriodos();
    } catch (error) {
        console.error('Erro ao salvar período:', error);
    }
};

const editarPeriodo = async (id) => {
    try {
        const p = await periodo.obterPorId(id);
        editandoId = id;
        document.getElementById('nome').value = p.nome;
        document.getElementById('dataInicio').value = p.dataInicio;
        document.getElementById('dataFim').value = p.dataFim;
        document.getElementById('formTitulo').textContent = 'Editar Período';
        document.getElementById('periodoModal').classList.add('show');
    } catch (error) {
        console.error('Erro ao carregar período:', error);
    }
};

const ativarPeriodo = async (id) => {
    try {
        await periodo.ativar(id);
        showAlert('Período ativado com sucesso!', 'success');
        await carregarPeriodos();
    } catch (error) {
        console.error('Erro ao ativar período:', error);
    }
};

const deletarPeriodo = async (id) => {
    if (confirm('Tem certeza que deseja deletar este período?')) {
        try {
            await periodo.deletar(id);
            showAlert('Período deletado com sucesso!', 'success');
            await carregarPeriodos();
        } catch (error) {
            console.error('Erro ao deletar período:', error);
        }
    }
};

document.addEventListener('DOMContentLoaded', carregarPeriodos);
