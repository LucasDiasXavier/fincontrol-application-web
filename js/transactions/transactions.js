import {
    carregarTransacoes,
    salvarTransacoes
} from '../storage/storage.js';

import { mostrarAviso } from '../utils/toast.js';


let transacoes = carregarTransacoes();


export function adicionarTransacao(dados) {

    console.log('1. adicionarTransacao foi chamada');

    const saldoAtual = transacoes.reduce(
        function (acc, t) {
            return acc + (t.tipo === 'receita' ? t.valor : -t.valor);
        },
        0
    );

    if (dados.tipo === 'despesa' && saldoAtual < dados.valor) {
        mostrarAviso(
            'Saldo insuficiente para esse lançamento de despesa.',
            'erro'
        );
        alert('saldo insulficiente');
        return false;
    }

    const novaTransacao = {
        id: Date.now(),
        ...dados
    };

    console.log('2. Nova transação:', novaTransacao);


    transacoes.push(novaTransacao);

    console.log('3. Lista:', transacoes);


    const salvou = salvarTransacoes(transacoes);

    console.log('4. Resultado do salvamento:', salvou);


    if (salvou) {

        mostrarAviso(
            'Lançamento salvo com sucesso.',
            'sucesso'
        );

        return true;

    }


    mostrarAviso(
        'Não foi possível salvar o lançamento.',
        'erro'
    );

    return false;
}


export function excluirTransacao(id) {

    transacoes =
        transacoes.filter(
            function (t) {

                return t.id !== id;

            }
        );


    const salvou =
        salvarTransacoes(transacoes);


    if (salvou) {

        mostrarAviso(
            'Lançamento excluído.',
            'sucesso'
        );

        return true;

    }


    mostrarAviso(
        'Não foi possível excluir o lançamento.',
        'erro'
    );

    return false;
}