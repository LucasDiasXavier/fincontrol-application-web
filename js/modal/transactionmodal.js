import { adicionarTransacao } from '../transactions/transactions.js';
import { mostrarAviso } from '../utils/toast.js';

export function iniciarFormularioNovoLancamento(aoSalvarComSucesso) {
    const form = document.getElementById('fc-form');
    // Se o form não existir nesta página, não faz nada
    if (!form) return;

    const botaoSalvar = form.querySelector('button[type="submit"]');
    const selectDescricao = document.getElementById('descricao');
    const inputDescricaoOutros = document.getElementById('descricao-outros');
    const inputValor = document.getElementById('valor');

    selectDescricao.addEventListener('change', function () {
        if (selectDescricao.value === 'outros') {
            inputDescricaoOutros.classList.add('is-visible');
            inputDescricaoOutros.focus();
        } else {
            inputDescricaoOutros.classList.remove('is-visible');
            inputDescricaoOutros.value = '';
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const tipoSelecionado = document.querySelector('input[name="tipo"]:checked');

        const descricao =
            selectDescricao.value === 'outros'
                ? inputDescricaoOutros.value.trim()
                : selectDescricao.value;

        const valor = parseFloat(inputValor.value);
        const data = new Date().toISOString().slice(0, 10);

        if (!descricao || !tipoSelecionado || isNaN(valor) || valor <= 0) {
            mostrarAviso('Preencha todos os campos corretamente.', 'erro');
            return;
        }

        const tipo = tipoSelecionado.id === 'fc-tipo-receita' ? 'receita' : 'despesa';

        botaoSalvar.disabled = true;
        botaoSalvar.textContent = 'Salvando...';

        const sucesso = adicionarTransacao({ data, descricao, tipo, valor });

        botaoSalvar.disabled = false;
        botaoSalvar.textContent = 'Salvar';

        if (sucesso) {
    form.reset();
    inputDescricaoOutros.classList.remove('is-visible');
    mostrarAviso('Transação salva com sucesso!', 'sucesso');

    // Volta para a aba Dashboard
    document.getElementById('fc-tab-dashboard').checked = true;

    if (typeof aoSalvarComSucesso === 'function') {
        aoSalvarComSucesso();
    }
}
    });
}