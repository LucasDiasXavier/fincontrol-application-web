async function loadComponent(id, file) {

    const response =
        await fetch(file);


    if (!response.ok) {

        throw new Error(
            `Erro ao carregar: ${file}`
        );

    }


    const component =
        await response.text();


    document.getElementById(id).innerHTML =
        component;

}


async function carregarPagina() {

    await loadComponent(
        'header-component',
        './pages/header.html'
    );


    await loadComponent(
        'home-component',
        './pages/home.html'
    );


    await import('./home.js');


    await loadComponent(
        'footer-component',
        './pages/footer.html'
    );

}


carregarPagina();