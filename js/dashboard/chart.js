import { formatarMoeda } from '../utils/formatters.js';
import { ANO_ATUAL } from '../utils/helpers.js';
import { processarDadosMensais, obterAnosDisponiveis } from './chartData.js';

const NOMES_MESES = [
    'Jan', 'Fev', 'Mar', 'Abr', 
    'Mai', 'Jun', 'Jul', 'Ago', 
    'Set', 'Out', 'Nov', 'Dez'
];

let anoSelecionado = ANO_ATUAL;
let instanciaGrafico = null;
let transacoesAtuais = [];

function criarSeletorAnos() {
    const select = document.getElementById('fc-ano-grafico');
    if (!select) return;

    const anosUnicos = obterAnosDisponiveis(transacoesAtuais);
    select.innerHTML = '';

    anosUnicos.forEach((ano) => {
        const option = document.createElement('option');
        option.value = ano;
        option.textContent = ano;
        if (ano === anoSelecionado) option.selected = true;
        select.appendChild(option);
    });

    select.onchange = () => {
        anoSelecionado = Number(select.value);
        atualizarGrafico();
    };
}

export function atualizarGrafico() {
    const { dadosReceitas, dadosDespesas } = processarDadosMensais(transacoesAtuais, anoSelecionado);

    if (instanciaGrafico) {
        instanciaGrafico.data.datasets[0].data = dadosReceitas;
        instanciaGrafico.data.datasets[1].data = dadosDespesas;
        instanciaGrafico.update();
        return;
    }

    const canvas = document.getElementById('fc-grafico-mensal');
    if (!canvas) return;

    instanciaGrafico = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: NOMES_MESES,
            datasets: [
                {
                    label: 'Receitas',
                    data: dadosReceitas,
                    backgroundColor: '#2e7d32',
                    borderRadius: 4
                },
                {
                    label: 'Despesas',
                    data: dadosDespesas,
                    backgroundColor: '#c62828',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${formatarMoeda(ctx.raw)}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (valor) => formatarMoeda(valor)
                    }
                }
            }
        }
    });
}

export function renderizarGrafico(transacoes) {
    transacoesAtuais = transacoes;
    criarSeletorAnos();
    atualizarGrafico();
}