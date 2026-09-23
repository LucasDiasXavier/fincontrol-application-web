import { iniciarFormularioNovoLancamento } from './modal/transactionmodal.js';
import { carregarTransacoes } from './storage/storage.js';
import { renderizarTudo } from './dashboard/dashboard.js';

function atualizarTela() {
    const transacoes = carregarTransacoes();
    renderizarTudo(transacoes, atualizarTela);
}

atualizarTela();
iniciarFormularioNovoLancamento(atualizarTela);