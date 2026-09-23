import { escapeHtml } from '../utils/helpers.js';
import { formatarDataExibicao, formatarMoeda } from '../utils/formatters.js';
import { excluirTransacao } from '../transactions/transactions.js';

export function renderizarTabela(transacoes, aoExcluirComSucesso) {
    const corpo = document.getElementById('fc-table-body');
    corpo.innerHTML = '';

    if (transacoes.length === 0) {
        corpo.innerHTML =
            '<tr class="fc-empty-row"><td colspan="5">Nenhum lançamento ainda.</td></tr>';
        return;
    }

    const ordenadas = transacoes.slice().sort(function (a, b) {
        return b.data.localeCompare(a.data);
    });

    ordenadas.forEach(function (t) {
        const linha = document.createElement('tr');
        const sinal = t.tipo === 'receita' ? '+' : '-';
        const classeValor = t.tipo === 'receita' ? 'positivo' : 'negativo';
        const rotuloTipo = t.tipo === 'receita' ? 'Receita' : 'Despesa';

        linha.innerHTML =
            '<td>' + formatarDataExibicao(t.data) + '</td>' +
            '<td>' + escapeHtml(t.descricao) + '</td>' +
            '<td><span class="fc-tag">' + escapeHtml(rotuloTipo) + '</span></td>' +
            '<td class="fc-amount ' + classeValor + '">' + sinal + ' ' + formatarMoeda(t.valor) + '</td>' +
            '<td>' +
                '<button type="button" class="fc-delete-btn" data-id="' + t.id + '" aria-label="Excluir lançamento">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                        '<path d="M3 6h18"/>' +
                        '<path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/>' +
                        '<path d="M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6"/>' +
                    '</svg>' +
                '</button>' +
            '</td>';

        corpo.appendChild(linha);
    });

    corpo.querySelectorAll('.fc-delete-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const sucesso = excluirTransacao(Number(btn.dataset.id));

            if (sucesso && typeof aoExcluirComSucesso === 'function') {
                aoExcluirComSucesso();
            }
        });
    });
}