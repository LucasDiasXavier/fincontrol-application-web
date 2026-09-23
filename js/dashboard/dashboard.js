import { renderizarCards } from './card.js';
import { renderizarTabela } from './table.js';

export function renderizarTudo(transacoes, aoMudarComSucesso) {
    renderizarCards(transacoes);
    renderizarTabela(transacoes, aoMudarComSucesso);
}