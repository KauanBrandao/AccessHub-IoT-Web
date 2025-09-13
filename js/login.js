
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyASpygXKT0cLOXVqvaiRp3sq4dDrmH1YXU",
  authDomain: "fechadura-digital-63428.firebaseapp.com",
  databaseURL: "https://fechadura-digital-63428-default-rtdb.firebaseio.com",
  projectId: "fechadura-digital-63428",
  storageBucket: "fechadura-digital-63428.firebasestorage.app",
  messagingSenderId: "520430669490",
  appId: "1:520430669490:web:360d44e3ee7b9e18be43ab"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const emailInput = document.getElementById("username").value.trim();
  const senhaInput = document.getElementById("password").value.trim();

  try {
    const snapshot = await get(ref(db, "Usuarios"));
    const data = snapshot.val();

    if (
      emailInput.toLowerCase() === data.Usuario1.toLowerCase() &&
      senhaInput === String(data.Senha)
    ) {
      localStorage.setItem("loggedInUser", emailInput);

      let userType = "user";
      if (emailInput.toLowerCase() === "usuario@gmail.com") {
        userType = "admin";
      }
      localStorage.setItem("userType", userType);

      window.location.href = "dashboard.html";
    } else {
      alert("Email ou senha inválidos");
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao acessar o banco de dados");
  }
});
