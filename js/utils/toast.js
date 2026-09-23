export function mostrarAviso(mensagem, tipo) {

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
