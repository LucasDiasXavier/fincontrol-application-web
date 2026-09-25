import { renderizarCards } from './card.js';
import { renderizarTabela } from './table.js';
import { renderizarGrafico } from './chart.js';

export function renderizarTudo(transacoes, aoMudarComSucesso) {
    renderizarCards(transacoes);
    renderizarTabela(transacoes, aoMudarComSucesso);
    renderizarGrafico(transacoes);
}