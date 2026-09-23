export function formatarMoeda(valor) {

    return new Intl.NumberFormat(
        'pt-BR',
        {
            style: 'currency',
            currency: 'BRL'
        }
    ).format(valor);

}

export function formatarDataExibicao(isoDate) {

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



