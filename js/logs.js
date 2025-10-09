// ===================================================================
// 1. IMPORTAÇÕES E CONFIGURAÇÃO
// ===================================================================
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { auth, db } from "./config-firebase.js";

// ===================================================================
// 2. SELETORES DE ELEMENTOS DO HTML
// ===================================================================
const navUsername = document.getElementById('nav-username');
const logoutButton = document.getElementById('logout-btn');
const logsList = document.getElementById('logs-list');
const searchInput = document.getElementById('search-input');

// ===================================================================
// 3. LÓGICA PRINCIPAL
// ===================================================================
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuário está logado, executa as funções principais
        buscarDadosDoUsuario(user.email);
        monitorarLogs();
        adicionarEventListeners();
    } else {
        // Usuário não está logado, redireciona
        window.location.href = 'login.html';
    }
});

// ===================================================================
// 4. FUNÇÕES
// ===================================================================

/**
 * Busca o nome do usuário no banco de dados e atualiza a navbar.
 */
async function buscarDadosDoUsuario(email) {
    const userRef = ref(db, 'Usuarios'); // Reutilizando a função do dashboard
    try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const userData = snapshot.val();
            if (userData.Usuario1 && userData.Usuario1.toLowerCase() === email.toLowerCase()) {
                navUsername.textContent = userData.Nome;
            }
        }
    } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
    }
}

/**
 * Monitora o nó de Logs no Firebase e popula a tabela.
 */
function monitorarLogs() {
    // IMPORTANTE: Verifique se o seu nó de logs no Firebase se chama "Logs"
    const logsRef = ref(db, 'Logs'); 

    onValue(logsRef, (snapshot) => {
        logsList.innerHTML = ''; // Limpa a tabela
        if (snapshot.exists()) {
            const todosLogs = snapshot.val();
            
            // Converte o objeto de logs em um array e ordena do mais recente para o mais antigo
            const logsArray = Object.values(todosLogs).sort((a, b) => {
                // Supondo que a data está em um formato que pode ser comparado
                return new Date(b.dataHora) - new Date(a.dataHora); 
            });

            logsArray.forEach(log => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${log.quemAcessou || 'N/A'}</td>
                    <td>${log.dataHora || 'N/A'}</td>
                    <td>${log.tempoAberta || 'N/A'}</td>
                    <td>${log.idCartao || 'N/A'}</td>
                `;
                logsList.appendChild(tr);
            });
        } else {
            logsList.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhum log encontrado.</td></tr>`;
        }
    });
}

/**
 * Filtra as linhas da tabela com base no texto digitado na busca.
 */
function filtrarTabela() {
    const termoBusca = searchInput.value.toLowerCase();
    const linhas = logsList.getElementsByTagName('tr');

    for (let i = 0; i < linhas.length; i++) {
        const textoLinha = linhas[i].textContent.toLowerCase();
        if (textoLinha.includes(termoBusca)) {
            linhas[i].style.display = ''; // Mostra a linha
        } else {
            linhas[i].style.display = 'none'; // Esconde a linha
        }
    }
}

/**
 * Adiciona os ouvintes de eventos para o logout e a busca.
 */
function adicionarEventListeners() {
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        signOut(auth).catch(error => console.error('Erro ao fazer logout:', error));
    });

    searchInput.addEventListener('keyup', filtrarTabela);
}