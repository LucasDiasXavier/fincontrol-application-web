import { ANO_ATUAL } from '../utils/helpers.js';

export function processarDadosMensais(transacoes, anoSelecionado) {
    const porMes = Array.from({ length: 12 }, () => ({
        receitas: 0,
        despesas: 0
    }));

    transacoes.forEach((t) => {
        const data = new Date(t.data + 'T00:00:00');
        const ano = data.getFullYear();
        const mes = data.getMonth();

        if (ano !== anoSelecionado) return;

        if (t.tipo === 'receita') {
            porMes[mes].receitas += Number(t.valor);
        } else {
            porMes[mes].despesas += Number(t.valor);
        }
    });

    return {
        dadosReceitas: porMes.map(m => m.receitas),
        dadosDespesas: porMes.map(m => m.despesas)
    };
}

export function obterAnosDisponiveis(transacoes) {
    const anos = transacoes.map((t) => new Date(t.data + 'T00:00:00').getFullYear());
    anos.push(ANO_ATUAL);
    return [...new Set(anos)].sort((a, b) => b - a);
}