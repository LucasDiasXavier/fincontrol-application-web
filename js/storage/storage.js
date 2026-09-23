const STORAGE_KEY = 'fincontrol-transacoes';


function storageDisponivel() {

    try {

        const chaveTeste = '__fincontrol_storage_test__';
        localStorage.setItem(chaveTeste, chaveTeste);
        localStorage.removeItem(chaveTeste);

        return true;

    } catch (erro) {

        console.warn(
            'LocalStorage indisponível no navegador:',
            erro
        );

        return false;
    }
}


function normalizarListaTransacoes(lista) {

    if (!Array.isArray(lista)) {
        return [];
    }

    return lista.filter(
        function (transacao) {
            return transacao && typeof transacao === 'object';
        }
    );
}


export function carregarTransacoes() {

    if (!storageDisponivel()) {
        return [];
    }

    try {

        const bruto = localStorage.getItem(STORAGE_KEY);


        if (bruto === null || bruto === '') {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify([])
            );

            return [];
        }


        const dados = JSON.parse(bruto);
        const listaNormalizada = normalizarListaTransacoes(dados);


        if (!Array.isArray(dados)) {

            console.warn(
                'Dados do LocalStorage em formato inválido. Reinicializando...'
            );

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify([])
            );

            return [];
        }


        if (listaNormalizada.length !== dados.length) {

            console.warn(
                'Algumas transações inválidas foram removidas do LocalStorage.'
            );

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(listaNormalizada)
            );
        }


        return listaNormalizada;

    } catch (erro) {

        console.error(
            'Erro ao carregar transações:',
            erro
        );

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify([])
        );

        return [];
    }
}


export function salvarTransacoes(lista) {

    if (!storageDisponivel()) {
        return false;
    }

    const listaNormalizada = normalizarListaTransacoes(lista);

    if (!Array.isArray(lista)) {

        console.error(
            'A lista de transações enviada para o LocalStorage é inválida.'
        );

        return false;
    }

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(listaNormalizada)
        );

        return true;

    } catch (erro) {

        console.error(
            'Erro ao salvar transações:',
            erro
        );

        return false;
    }
}