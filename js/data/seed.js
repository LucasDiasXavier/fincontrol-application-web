import { dataRelativa } from '../utils/helpers.js';

export const seedtransacoes = [

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