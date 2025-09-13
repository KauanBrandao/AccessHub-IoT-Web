// Importa Firebase (ES Module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

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

export { app, db };
