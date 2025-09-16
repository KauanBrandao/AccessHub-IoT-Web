import { ref, push, set, get } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { db } from "./config-firebase.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-card-form');
    const feedbackMessage = document.getElementById('feedback-message');
    const pageTitle = document.querySelector('h2');

    // --- Verifica se é modo de edição ---
    const urlParams = new URLSearchParams(window.location.search);
    const idParaEditar = urlParams.get('id');

    if (idParaEditar) {
        pageTitle.textContent = "Editar Cartão";
        const cartaoRef = ref(db, 'Cartões/' + idParaEditar);
        get(cartaoRef).then((snapshot) => {
            if (snapshot.exists()) {
                const cartao = snapshot.val();
                form.usuario.value = cartao.Usuario;
                form.idCartao.value = cartao.idCartao;
                form.status.value = cartao.Status;
            } else {
                feedbackMessage.textContent = "Cartão não encontrado.";
                feedbackMessage.style.color = "#dc3545";
            }
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const usuario = form.usuario.value;
        const idCartao = form.idCartao.value;
        const status = form.status.value;
        const ultimoUso = new Date().toLocaleString('pt-BR');

        if (idParaEditar) {
            const cartaoRef = ref(db, 'Cartões/' + idParaEditar);
            set(cartaoRef, {
                Usuario: usuario,
                idCartao: idCartao,
                Status: status,
                ultimoUso: ultimoUso
            })
            .then(() => {
                alert("Cartão atualizado com sucesso!");
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                console.error("Erro ao atualizar cartão:", error);
                feedbackMessage.textContent = "Erro ao atualizar. Verifique o console.";
                feedbackMessage.style.color = "#dc3545";
            });
        } else {
            const cartoesRef = ref(db, 'Cartões');
            const novoCartaoRef = push(cartoesRef);

            set(novoCartaoRef, {
                Usuario: usuario,
                idCartao: idCartao,
                Status: status,
                ultimoUso: ultimoUso
            })
            .then(() => {
                alert("Cartão cadastrado com sucesso!");
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                console.error("Erro ao cadastrar cartão:", error);
                feedbackMessage.textContent = "Erro ao cadastrar. Verifique o console.";
                feedbackMessage.style.color = "#dc3545";
            });
        }
    });
});