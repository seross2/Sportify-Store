document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const formResponse = document.getElementById('form-response');

    const handleFormSubmit = (form, endpoint) => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            formResponse.textContent = 'Procesando...';
            formResponse.style.color = '#333';

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                    formResponse.textContent = result.message;
                    formResponse.style.color = 'green';
                    form.reset();
                    // Si el registro o login es exitoso, redirigir al inicio después de 2 segundos
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                } else {
                    // Mostrar error del servidor
                    formResponse.textContent = `Error: ${result.error}`;
                    formResponse.style.color = 'red';
                }
            } catch (error) {
                console.error('Error en la petición:', error);
                formResponse.textContent = 'Hubo un problema de conexión. Inténtalo de nuevo.';
                formResponse.style.color = 'red';
            }
        });
    };

    if (loginForm) {
        handleFormSubmit(loginForm, '/api/login');
    }

    if (registerForm) {
        handleFormSubmit(registerForm, '/api/register');
    }

    // Lógica para mostrar el estado de la sesión en el header (opcional pero recomendado)
    const nav = document.querySelector('header nav ul');
    const loginLink = document.getElementById('login-link'); // Obtenemos el <li> del login

    if (nav) {
        fetch('/api/session')
            .then(res => res.json())
            .then(data => {
                if (data.loggedIn) {
                    // Si está logueado, ocultamos el enlace de Login
                    if (loginLink) {
                        loginLink.style.display = 'none';
                    }

                    // Si está logueado, muestra su email y un botón de logout
                    const userLi = document.createElement('li');
                    userLi.innerHTML = `<span style="padding: 0 15px; color: #fff;">${data.user.email}</span>`;

                    const logoutLi = document.createElement('li');
                    const logoutLink = document.createElement('a');
                    logoutLink.href = '#';
                    logoutLink.textContent = 'Logout';
                    logoutLink.onclick = (e) => {
                        e.preventDefault();
                        fetch('/api/logout').then(() => window.location.href = '/login');
                    };
                    logoutLi.appendChild(logoutLink);

                    // Insertamos los nuevos elementos al final de la lista de navegación
                    nav.insertAdjacentElement('beforeend', userLi);
                    nav.insertAdjacentElement('beforeend', logoutLi);
                }
            });
    }
});