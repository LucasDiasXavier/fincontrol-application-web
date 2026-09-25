import {
    formatarMoeda
} from '../utils/formatters.js';


const NOMES_MESES = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez'
];


const ANO_ATUAL =
    new Date().getFullYear();


let anoSelecionado =
    ANO_ATUAL;


let instanciaGrafico =
    null;


let transacoesAtuais =
    [];


function criarSeletorAnos(transacoes) {

    const select =
        document.getElementById(
            'fc-ano-grafico'
        );


    if (!select) return;


    const anos =
        transacoes.map(
            function (t) {

                return new Date(
                    t.data + 'T00:00:00'
                ).getFullYear();

            }
        );


    anos.push(ANO_ATUAL);


    const anosUnicos =
        [...new Set(anos)]
            .sort(
                function (a, b) {

                    return b - a;

                }
            );


    select.innerHTML = '';


    anosUnicos.forEach(
        function (ano) {

            const option =
                document.createElement(
                    'option'
                );


            option.value =
                ano;


            option.textContent =
                ano;


            if (
                ano ===
                anoSelecionado
            ) {

                option.selected =
                    true;

            }


            select.appendChild(
                option
            );

        }
    );


    select.onchange =
        function () {

            anoSelecionado =
                Number(
                    select.value
                );


            atualizarGrafico();

        };

}


function atualizarGrafico() {

    const porMes =
        Array.from(
            { length: 12 },
            function () {

                return {
                    receitas: 0,
                    despesas: 0
                };

            }
        );


    transacoesAtuais.forEach(
        function (t) {

            const data =
                new Date(
                    t.data +
                    'T00:00:00'
                );


            const ano =
                data.getFullYear();


            const mes =
                data.getMonth();


            if (
                ano !==
                anoSelecionado
            ) {

                return;

            }


            if (
                t.tipo ===
                'receita'
            ) {

                porMes[mes].receitas +=
                    Number(t.valor);

            } else {

                porMes[mes].despesas +=
                    Number(t.valor);

            }

        }
    );


    const dadosReceitas =
        porMes.map(
            function (mes) {

                return mes.receitas;

            }
        );


    const dadosDespesas =
        porMes.map(
            function (mes) {

                return mes.despesas;

            }
        );


    if (instanciaGrafico) {

        instanciaGrafico
            .data
            .datasets[0]
            .data =
            dadosReceitas;


        instanciaGrafico
            .data
            .datasets[1]
            .data =
            dadosDespesas;


        instanciaGrafico.update();

        return;

    }


    const canvas =
        document.getElementById(
            'fc-grafico-mensal'
        );


    if (!canvas) return;


    instanciaGrafico =
        new Chart(
            canvas.getContext('2d'),
            {

                type: 'bar',

                data: {

                    labels:
                        NOMES_MESES,

                    datasets: [

                        {
                            label:
                                'Receitas',

                            data:
                                dadosReceitas,

                            backgroundColor:
                                '#2e7d32',

                            borderRadius:
                                4
                        },

                        {
                            label:
                                'Despesas',

                            data:
                                dadosDespesas,

                            backgroundColor:
                                '#c62828',

                            borderRadius:
                                4
                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            position:
                                'top'

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (ctx) {

                                        return (
                                            ctx.dataset.label +
                                            ': ' +
                                            formatarMoeda(
                                                ctx.raw
                                            )
                                        );

                                    }

                            }

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                callback:
                                    function (valor) {

                                        return formatarMoeda(
                                            valor
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}


export function renderizarGrafico(
    transacoes
) {

    transacoesAtuais =
        transacoes;


    criarSeletorAnos(
        transacoes
    );


    atualizarGrafico();

}