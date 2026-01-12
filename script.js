// carregar contactes del JSON o del localStorage
async function carregarContactes() {
    let contactes = localStorage.getItem("contactes");

    if (contactes) {
        return JSON.parse(contactes);
    } else {
        // primer cop, llegim el JSON
        const resposta = await fetch("contacts.json");
        const dades = await resposta.json();
        localStorage.setItem("contactes", JSON.stringify(dades));
        return dades;
    }
}

// guardar contactes al localStorage
function guardarContactes(contactes) {
    localStorage.setItem("contactes", JSON.stringify(contactes));
}

// ===== INDEX =====
async function mostrarContactes() {
    const contactes = await carregarContactes();
    const tbody = document.getElementById("taulaContactes");

    tbody.innerHTML = ""; // neteja la taula pq sino es lia

    contactes.forEach(c => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${c.nom}</td>
            <td>${c.email}</td>
            <td>${c.telefon}</td>
            <td>
                <a href="detall.html?id=${c.id}">Veure</a>
                <button onclick="esborrarContacte(${c.id})">X</button>
            </td>
        `;

        tbody.appendChild(fila);
    });
}

async function esborrarContacte(id) {
    let contactes = await carregarContactes();
    contactes = contactes.filter(c => c.id !== id);
    guardarContactes(contactes);
    mostrarContactes(); // refresquem, easy
}

// ===== AFEGIR =====
async function afegirContacte(e) {
    e.preventDefault(); // evitem que recarregui la pagina pq sino es una merda

    const nom = document.getElementById("nom").value;
    const email = document.getElementById("email").value;
    const telefon = document.getElementById("telefon").value;

    let contactes = await carregarContactes();

    const nouContacte = {
        id: Date.now(), // id random prou bo
        nom,
        email,
        telefon
    };

    contactes.push(nouContacte);
    guardarContactes(contactes);

    window.location.href = "index.html";
}

// ===== DETALL =====
async function mostrarDetall() {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    const contactes = await carregarContactes();
    const contacte = contactes.find(c => c.id === id);

    if (!contacte) return;

    document.getElementById("nom").value = contacte.nom;
    document.getElementById("email").value = contacte.email;
    document.getElementById("telefon").value = contacte.telefon;
}

async function guardarCanvis(e) {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    let contactes = await carregarContactes();

    contactes = contactes.map(c => {
        if (c.id === id) {
            c.nom = document.getElementById("nom").value;
            c.email = document.getElementById("email").value;
            c.telefon = document.getElementById("telefon").value;
        }
        return c;
    });

    guardarContactes(contactes);
    window.location.href = "index.html";
}
