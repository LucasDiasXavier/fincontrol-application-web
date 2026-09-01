async function loadComponent(id, file) {
  const response = await fetch(file);

  const component = await response.text();

  document.getElementById(id).innerHTML = component;
}

loadComponent(
  "header-component",
  "./components/header.html"
);

loadComponent(
    "home-component",
    "./pages/home.html"
);