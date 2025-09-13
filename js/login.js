import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("usuario@gmail.com");
const passwordInput = document.getElementById("123456");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = usernameInput.value;
  const password = passwordInput.value;

  try {
    
    await signInWithEmailAndPassword(auth, email, password);

    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Erro no login: " + error.message);
  }
});
