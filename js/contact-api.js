document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contact-form');
    const formResponse = document.getElementById('form-response');

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita que el formulario se envíe de la forma tradicional

        const formData = new FormData(contactForm);
        // Convertimos los datos del formulario a un objeto simple
        const data = Object.fromEntries(formData.entries());

        formResponse.textContent = 'Enviando...';
        formResponse.style.color = '#333';

        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // Enviamos los datos como una cadena JSON
        })
        .then(response => response.json())
        .then(result => {
            // Mostramos el mensaje de éxito del servidor
            formResponse.textContent = result.message;
            formResponse.style.color = 'green';
            contactForm.reset(); // Limpiamos el formulario
        })
        .catch(error => {
            console.error('Error al enviar el formulario:', error);
            formResponse.textContent = 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.';
            formResponse.style.color = 'red';
        });
    });
});