import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { auth, db } from "./config-firebase.js";

// --- SELETORES DE ELEMENTOS ---
const userEmailDisplay = document.getElementById('user-email-display');
const userRoleDisplay = document.getElementById('user-role-display');
const showLogoutModalBtn = document.getElementById('show-logout-modal-btn');
const logoutModal = document.getElementById('logout-modal');
const cancelLogoutBtn = document.getElementById('cancel-logout-btn');
const confirmLogoutBtn = document.getElementById('confirm-logout-btn');

// --- LÓGICA PRINCIPAL ---

onAuthStateChanged(auth, (user) => {
    if (user) {
        buscarDadosDoUsuario(user.email);
    } else {
        window.location.href = 'login.html';
    }
});

// ===================================================================
// AQUI ESTÁ A MUDANÇA PRINCIPAL
// Esta função agora procura o usuário em uma lista
// ===================================================================
async function buscarDadosDoUsuario(emailLogado) {
    const usuariosRef = ref(db, 'Usuarios');
    try {
        const snapshot = await get(usuariosRef);
        if (snapshot.exists()) {
            const todosUsuarios = snapshot.val();
            let usuarioEncontrado = false;

            // Procura em cada usuário dentro do nó "Usuarios"
            for (const idDoUsuario in todosUsuarios) {
                const dadosDoUsuario = todosUsuarios[idDoUsuario];

                // Verifica se o email do usuário no banco é igual ao email logado
                // Funciona se a chave for "Usuario1" ou "email"
                if (dadosDoUsuario && (dadosDoUsuario.Usuario1 === emailLogado || dadosDoUsuario.email === emailLogado)) {
                    
                    // Encontrou! Atualiza as informações na tela.
                    userEmailDisplay.textContent = emailLogado;
                    userRoleDisplay.textContent = dadosDoUsuario.Role || 'Indefinido';
                    
                    usuarioEncontrado = true;
                    break; // Para o loop assim que encontrar o usuário
                }
            }

            if (!usuarioEncontrado) {
                console.warn("Usuário logado não foi encontrado no banco de dados.");
                userEmailDisplay.textContent = "Usuário não encontrado";
                userRoleDisplay.textContent = "N/A";
            }

        } else {
            console.error("O nó 'Usuarios' não existe no banco de dados.");
        }
    } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
    }
}


// --- CONTROLES DO MODAL ---
showLogoutModalBtn.addEventListener('click', () => {
    logoutModal.classList.add('active');
});

cancelLogoutBtn.addEventListener('click', () => {
    logoutModal.classList.remove('active');
});

confirmLogoutBtn.addEventListener('click', () => {
    signOut(auth).catch(error => console.error('Erro ao fazer logout:', error));
});