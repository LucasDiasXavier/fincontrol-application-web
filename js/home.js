// ============================================
// FinControl — Lógica do Dashboard
// ============================================

const STORAGE_KEY = 'fincontrol-transacoes';


// ============================================
// Dados iniciais
// ============================================

function dataRelativa(diasAtras) {

    const d = new Date();

    d.setDate(d.getDate() - diasAtras);

    return (
        d.getFullYear() +
        '-' +
        String(d.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(d.getDate()).padStart(2, '0')
    );

}


const seedTransacoes = [

    {
        id: 1,
        data: dataRelativa(2),
        descricao: 'Salário',
        categoria: 'Receita',
        tipo: 'receita',
        valor: 5100.00
    },

    {
        id: 2,
        data: dataRelativa(3),
        descricao: 'Supermercado',
        categoria: 'Alimentação',
        tipo: 'despesa',
        valor: 320.40
    },

    {
        id: 3,
        data: dataRelativa(5),
        descricao: 'Conta de luz',
        categoria: 'Moradia',
        tipo: 'despesa',
        valor: 189.00
    },

    {
        id: 4,
        data: dataRelativa(8),
        descricao: 'Assinatura streaming',
        categoria: 'Lazer',
        tipo: 'despesa',
        valor: 39.90
    },

    {
        id: 5,
        data: dataRelativa(10),
        descricao: 'Combustível',
        categoria: 'Transporte',
        tipo: 'despesa',
        valor: 210.20
    }

];


let transacoes = [];


// ============================================
// Armazenamento
// ============================================

function carregarTransacoes() {

    try {

        const bruto = localStorage.getItem(STORAGE_KEY);

        if (!bruto) {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(seedTransacoes)
            );

            return seedTransacoes.slice();

        }

        const dados = JSON.parse(bruto);

        return Array.isArray(dados)
            ? dados
            : seedTransacoes.slice();

    } catch (erro) {

        mostrarAviso(
            'Não foi possível carregar os dados salvos. Iniciando com valores de exemplo.',
            'erro'
        );

        return seedTransacoes.slice();

    }

}


function salvarTransacoes(lista) {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(lista)
        );

        return true;

    } catch (erro) {

        mostrarAviso(
            'Não foi possível salvar. Verifique se o navegador permite armazenamento local.',
            'erro'
        );

        return false;

    }

}


// ============================================
// Feedback visual
// ============================================

function mostrarAviso(mensagem, tipo) {

    const existente =
        document.getElementById('fc-toast');

    if (existente) {
        existente.remove();
    }


    const toast = document.createElement('div');

    toast.id = 'fc-toast';

    toast.className =
        'fc-toast fc-toast-' +
        (tipo || 'sucesso');

    toast.textContent = mensagem;


    document.body.appendChild(toast);


    setTimeout(function () {

        toast.classList.add(
            'fc-toast-saindo'
        );


        setTimeout(function () {

            toast.remove();

        }, 250);

    }, 2200);

}


// ============================================
// Helpers
// ============================================

function formatarMoeda(valor) {

    return new Intl.NumberFormat(
        'pt-BR',
        {
            style: 'currency',
            currency: 'BRL'
        }
    ).format(valor);

}


function formatarDataExibicao(isoDate) {

    const partes =
        isoDate.split('-');

    return (
        partes[2] +
        '/' +
        partes[1] +
        '/' +
        partes[0]
    );

}


function mesAtual() {

    const agora = new Date();

    return (
        agora.getFullYear() +
        '-' +
        String(agora.getMonth() + 1).padStart(2, '0')
    );

}


function gerarId() {

    return (
        Date.now() +
        Math.floor(Math.random() * 1000)
    );

}


// ============================================
// Renderização dos Cards
// ============================================

function renderizarCards() {

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


// ============================================
// Renderização da tabela
// ============================================

function renderizarTabela() {

    const corpo =
        document.getElementById(
            'fc-table-body'
        );


    corpo.innerHTML = '';


    if (transacoes.length === 0) {

        corpo.innerHTML =
            '<tr class="fc-empty-row">' +
                '<td colspan="5">' +
                    'Nenhum lançamento ainda.' +
                '</td>' +
            '</tr>';

        return;

    }


    const ordenadas =
        transacoes
            .slice()
            .sort(
                function (a, b) {

                    return b.data.localeCompare(
                        a.data
                    );

                }
            );


    ordenadas.forEach(
        function (t) {

            const linha =
                document.createElement('tr');


            const sinal =
                t.tipo === 'receita'
                    ? '+'
                    : '-';


            const classeValor =
                t.tipo === 'receita'
                    ? 'positivo'
                    : 'negativo';


            linha.innerHTML =

                '<td>' +
                    formatarDataExibicao(
                        t.data
                    ) +
                '</td>' +

                '<td>' +
                    escapeHtml(
                        t.descricao
                    ) +
                '</td>' +

                '<td>' +
                    '<span class="fc-tag">' +
                        escapeHtml(
                            t.categoria
                        ) +
                    '</span>' +
                '</td>' +

                '<td class="fc-amount ' +
                    classeValor +
                '">' +

                    sinal +
                    ' ' +
                    formatarMoeda(
                        t.valor
                    ) +

                '</td>' +

                '<td>' +

                    '<button ' +
                        'type="button" ' +
                        'class="fc-delete-btn" ' +
                        'data-id="' +
                            t.id +
                        '" ' +
                        'aria-label="Excluir lançamento"' +
                    '>' +

                        '<svg ' +
                            'viewBox="0 0 24 24" ' +
                            'fill="none" ' +
                            'stroke="currentColor" ' +
                            'stroke-width="2" ' +
                            'stroke-linecap="round" ' +
                            'stroke-linejoin="round"' +
                        '>' +

                            '<path d="M3 6h18"/>' +

                            '<path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/>' +

                            '<path d="M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6"/>' +

                        '</svg>' +

                    '</button>' +

                '</td>';


            corpo.appendChild(linha);

        }
    );


    document
        .querySelectorAll('.fc-delete-btn')
        .forEach(
            function (btn) {

                btn.addEventListener(
                    'click',
                    function () {

                        excluirTransacao(
                            Number(
                                btn.dataset.id
                            )
                        );

                    }
                );

            }
        );

}


// ============================================
// Segurança para textos inseridos na tabela
// ============================================

function escapeHtml(texto) {

    const div =
        document.createElement('div');

    div.textContent = texto;

    return div.innerHTML;

}


// ============================================
// Renderização geral
// ============================================

function renderizarTudo() {

    renderizarCards();

    renderizarTabela();

}


// ============================================
// Excluir transação
// ============================================

function excluirTransacao(id) {

    transacoes =
        transacoes.filter(
            function (t) {

                return t.id !== id;

            }
        );


    renderizarTudo();


    if (salvarTransacoes(transacoes)) {

        mostrarAviso(
            'Lançamento excluído.',
            'sucesso'
        );

    } else {

        mostrarAviso(
            'Excluído nesta sessão, mas não foi possível salvar em disco.',
            'erro'
        );

    }

}


// ============================================
// Adicionar transação
// ============================================

function adicionarTransacao(dados) {

    const novaTransacao =
        Object.assign(
            {
                id: gerarId()
            },
            dados
        );


    transacoes =
        transacoes.concat([
            novaTransacao
        ]);


    renderizarTudo();


    if (salvarTransacoes(transacoes)) {

        mostrarAviso(
            'Lançamento salvo com sucesso.',
            'sucesso'
        );

    } else {

        mostrarAviso(
            'Adicionado nesta sessão, mas não foi possível salvar em disco.',
            'erro'
        );

    }


    return true;

}


// ============================================
// Modal
// ============================================

const overlay =
    document.getElementById(
        'fc-modal-overlay'
    );


const form =
    document.getElementById(
        'fc-form'
    );


const botaoSalvar =
    form.querySelector(
        'button[type="submit"]'
    );


function abrirModal() {

    overlay.classList.add(
        'is-open'
    );


    document.getElementById(
        'fc-input-data'
    ).value =
        new Date()
            .toISOString()
            .slice(0, 10);


    document.getElementById(
        'fc-input-descricao'
    ).focus();

}


function fecharModal() {

    overlay.classList.remove(
        'is-open'
    );


    form.reset();

}


// ============================================
// Eventos do Modal
// ============================================

document
    .getElementById('fc-open-modal')
    .addEventListener(
        'click',
        abrirModal
    );


document
    .getElementById('fc-close-modal')
    .addEventListener(
        'click',
        fecharModal
    );


overlay.addEventListener(
    'click',
    function (e) {

        if (e.target === overlay) {

            fecharModal();

        }

    }
);


// ============================================
// Submit do formulário
// ============================================

form.addEventListener(
    'submit',
    function (e) {

        e.preventDefault();


        const tipo =
            document.querySelector(
                'input[name="fc-tipo"]:checked'
            ).value;


        const descricao =
            document
                .getElementById(
                    'fc-input-descricao'
                )
                .value
                .trim();


        const categoria =
            document
                .getElementById(
                    'fc-input-categoria'
                )
                .value
                .trim();


        const valorTexto =
            document.getElementById(
                'fc-input-valor'
            ).value;


        const valor =
            parseFloat(valorTexto);


        const data =
            document.getElementById(
                'fc-input-data'
            ).value;


        // Validação
        if (
            !descricao ||
            !categoria ||
            !data ||
            isNaN(valor) ||
            valor <= 0
        ) {

            mostrarAviso(
                'Preencha todos os campos corretamente.',
                'erro'
            );

            return;

        }


        // Estado do botão
        botaoSalvar.disabled = true;

        botaoSalvar.textContent =
            'Salvando...';


        // Criar transação
        const sucesso =
            adicionarTransacao({

                data: data,

                descricao: descricao,

                categoria: categoria,

                tipo: tipo,

                valor: valor

            });


        // Restaurar botão
        botaoSalvar.disabled = false;

        botaoSalvar.textContent =
            'Salvar';


        // Fechar modal
        if (sucesso) {

            fecharModal();

        }

    }
);


// ============================================
// Inicialização
// ============================================

transacoes =
    carregarTransacoes();

renderizarTudo();