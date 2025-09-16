import { ref, get, onValue, set, remove } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { db } from "./config-firebase.js";

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se o usuário está logado e atualiza a interface
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }
    const usernameDisplay = document.getElementById('username-display');
    const profileAvatar = document.getElementById('profile-initial-avatar');
    usernameDisplay.textContent = loggedInUser;
    const firstInitial = loggedInUser.charAt(0).toUpperCase();
    profileAvatar.textContent = firstInitial;

    // --- FUNÇÃO PARA CARREGAR OS CARTÕES DO FIREBASE ---
    function carregarCartoesDoFirebase() {
        const tabelaCorpo = document.getElementById('cartoes-list');
        tabelaCorpo.innerHTML = '';

        const cartoesRef = ref(db, 'Cartões');

        get(cartoesRef).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const cartao = childSnapshot.val();
                    const cartaoId = childSnapshot.key;

                    const status = cartao.Status || 'Desconhecido';
                    const statusClass = status.toLowerCase() === 'liberado' ? 'status-liberado' : 'status-bloqueado';

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${cartao.Usuario}</td>
                        <td>${cartao.ultimoUso}</td>
                        <td>${cartao.idCartao}</td>
                        <td class="${statusClass}">${status}</td>
                        <td class="icon-actions">
                            <i class='bx bxs-edit btn-edit-card' data-id="${cartaoId}" title="Editar"></i>
                            <i class='bx bxs-trash btn-delete-card' data-id="${cartaoId}" title="Apagar"></i>
                        </td>
                    `;
                    tabelaCorpo.appendChild(tr);
                });
                
                tabelaCorpo.querySelectorAll('.btn-delete-card').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const idParaApagar = e.target.dataset.id;
                        if (confirm("Tem certeza que deseja apagar este cartão?")) {
                            const cartaoParaApagarRef = ref(db, 'Cartões/' + idParaApagar);
                            remove(cartaoParaApagarRef)
                                .then(() => {
                                    console.log("Cartão apagado com sucesso.");
                                })
                                .catch((error) => {
                                    console.error("Erro ao apagar cartão:", error);
                                });
                        }
                    });
                });
            } else {
                tabelaCorpo.innerHTML = `<tr><td colspan="5" style="text-align:center; color: #adb5bd;">Nenhum cartão cadastrado.</td></tr>`;
            }
        }).catch((error) => {
            console.error("Erro ao buscar dados do Firebase:", error);
            tabelaCorpo.innerHTML = `<tr><td colspan="5" style="text-align:center; color: #dc3545;">Erro ao carregar os cartões.</td></tr>`;
        });
    }

    // --- FUNÇÃO PARA MONITORAR O STATUS DA PORTA EM TEMPO REAL ---
    function monitorarStatusPorta() {
        const lockStatusText = document.getElementById('lock-status-text');
        const portaStatusRef = ref(db, 'Porta/Status');

        onValue(portaStatusRef, (snapshot) => {
            const statusAtual = snapshot.val();
            
            if (statusAtual) {
                lockStatusText.textContent = statusAtual;

                lockStatusText.classList.remove('status-open', 'status-closed');

                if (statusAtual.toLowerCase() === 'destrancada') {
                    lockStatusText.classList.add('status-open');
                } else if (statusAtual.toLowerCase() === 'trancada') {
                    lockStatusText.classList.add('status-closed');
                }
            } else {
                lockStatusText.textContent = 'Status Indisponível';
                lockStatusText.classList.remove('status-open', 'status-closed');
            }
        }, {
            onlyOnce: false
        });
    }
    
    // --- LÓGICA DO BOTÃO TRANCAR/DESTRANCAR ---
    const lockToggleButton = document.getElementById('lock-toggle-btn');
    const portaStatusRef = ref(db, 'Porta/Status');

    lockToggleButton.addEventListener('click', () => {
        get(portaStatusRef).then((snapshot) => {
            const statusAtual = snapshot.val();
            let novoStatus;

            if (statusAtual.toLowerCase() === 'trancada') {
                novoStatus = 'Destrancada';
            } else {
                novoStatus = 'Trancada';
            }

            set(portaStatusRef, novoStatus)
                .then(() => {
                    console.log("Status da porta atualizado para:", novoStatus);
                })
                .catch((error) => {
                    console.error("Erro ao atualizar o status:", error);
                });
        });
    });
    
    // --- LÓGICA DE EDIÇÃO ---
    // Adiciona o ouvinte de evento para os botões de edição
    document.getElementById('cartoes-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-edit-card')) {
            const idParaEditar = e.target.dataset.id;
            window.location.href = `cadastrarCartao.html?id=${idParaEditar}`;
        }
    });

    // Chama as duas funções principais
    carregarCartoesDoFirebase();
    monitorarStatusPorta();
});