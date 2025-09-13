document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }


    const usernameDisplays = document.querySelectorAll('#username-display');
    usernameDisplays.forEach(el => el.textContent = loggedInUser);

 
    const userTypeDisplays = document.querySelectorAll('#user-type');
    userTypeDisplays.forEach(el => {
        
        if (loggedInUser === "usuario@gmail.com") {
            el.textContent = "Administrador";
        } else {
            el.textContent = "Usuário";
        }
    });

    const mainLogoutButton = document.getElementById('logout-button');
    const modalOverlay = document.getElementById('logout-modal');
    const cancelButton = document.getElementById('cancel-logout');
    const confirmButton = document.getElementById('confirm-logout');

    if (mainLogoutButton && modalOverlay && cancelButton && confirmButton) {
        mainLogoutButton.addEventListener('click', () => {
            modalOverlay.classList.add('active');
        });

        const closeModal = () => {
            modalOverlay.classList.remove('active');
        }

        cancelButton.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) closeModal();
        });

        confirmButton.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'login.html';
        });
    }
});
