document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }

    const usernameDisplay = document.getElementById('username-display');
    const userType = document.getElementById('user-type');

    usernameDisplay.textContent = loggedInUser;

    // Se o usuário tiver "@" no email, é admin
    if (loggedInUser.includes('@')) {
        userType.textContent = 'Administrador';
    }

    // Modal de Logout
    const logoutButton = document.getElementById('logout-button');
    const modalOverlay = document.getElementById('logout-modal');
    const cancelButton = document.getElementById('cancel-logout');
    const confirmButton = document.getElementById('confirm-logout');

    logoutButton.addEventListener('click', () => {
        modalOverlay.classList.add('active');
    });

    const closeModal = () => modalOverlay.classList.remove('active');

    cancelButton.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', e => {
        if (e.target === modalOverlay) closeModal();
    });

    confirmButton.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    });
});
