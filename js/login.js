// Importa Firebase (como ES Module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    databaseURL: "https://fechadura-digital-63428-default-rtdb.firebaseio.com/"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("username").value;
    const senha = document.getElementById("password").value;

    try {
        const snapshot = await get(ref(db, "Usuarios"));
        const data = snapshot.val();

        // Verifica se o email e senha batem
        if (email === data.Usuario1 && senha === data.Senha) {
            // Login OK
            localStorage.setItem("loggedInUser", email); // opcional, se quiser usar na dashboard
            window.location.href = "dashboard.html";
        } else {
            alert("Email ou senha inválidos");
        }
    } catch (err) {
        console.error(err);
        alert("Erro ao acessar o banco de dados");
    }
});
