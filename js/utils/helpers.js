

export function mesAtual() {

    const agora = new Date();

    return (
        agora.getFullYear() +
        '-' +
        String(
            agora.getMonth() + 1
        ).padStart(2, '0')
    );

}


// ============================================
// Data relativa
// ============================================

export function dataRelativa(dias) {

    const data = new Date();

    data.setDate(
        data.getDate() + dias
    );

    return data
        .toISOString()
        .slice(0, 10);

}


// ============================================
// Gerar ID
// ============================================

export function gerarId() {

    return (
        Date.now() +
        Math.floor(
            Math.random() * 1000
        )
    );

}


export function escapeHtml(texto) {

    const div =
        document.createElement('div');

    div.textContent = texto;

    return div.innerHTML;

}