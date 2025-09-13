// Importa Firebase (ES Module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyASpygXKT0cLOXVqvaiRp3sq4dDrmH1YXU",
  authDomain: "fechadura-digital-63428.firebaseapp.com",
  databaseURL: "https://fechadura-digital-63428-default-rtdb.firebaseio.com",
  projectId: "fechadura-digital-63428",
  storageBucket: "fechadura-digital-63428.firebasestorage.app",
  messagingSenderId: "520430669490",
  appId: "1:520430669490:web:360d44e3ee7b9e18be43ab"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const form = document.getElementById("login-form");
const modal = document.getElementById("login-error-modal");
const closeModalBtn = document.getElementById("close-login-error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const emailInput = document.getElementById("username").value.trim();
  const senhaInput = document.getElementById("password").value.trim();

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

// Fecha o modal ao clicar no botão
closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});
