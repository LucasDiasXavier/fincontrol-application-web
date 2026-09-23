import {
    formatarMoeda
} from '../utils/formatters.js';

import {
    mesAtual
} from '../utils/helpers.js';



export function renderizarCards(transacoes) {

    const saldo =
        transacoes.reduce(
            function (acc, t) {

                return acc +
                    (
                        t.tipo === 'receita'
                            ? t.valor
                            : -t.valor
                    );

            },
            0
        );


    const doMes =
        transacoes.filter(
            function (t) {

                return t.data.startsWith(
                    mesAtual()
                );

            }
        );


    const receitasMes =
        doMes
            .filter(
                function (t) {

                    return t.tipo === 'receita';

                }
            )
            .reduce(
                function (acc, t) {

                    return acc + t.valor;

                },
                0
            );


    const despesasMes =
        doMes
            .filter(
                function (t) {

                    return t.tipo === 'despesa';

                }
            )
            .reduce(
                function (acc, t) {

                    return acc + t.valor;

                },
                0
            );


    document.getElementById(
        'fc-valor-saldo'
    ).textContent =
        formatarMoeda(saldo);


    document.getElementById(
        'fc-valor-receitas'
    ).textContent =
        formatarMoeda(receitasMes);


    document.getElementById(
        'fc-valor-despesas'
    ).textContent =
        formatarMoeda(despesasMes);

}