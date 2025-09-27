document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#contact form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío predeterminado del formulario

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (name === '' || email === '' || message === '') {
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Validación básica de formato de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingrese un correo electrónico válido.');
            return;
        }

        // Si todo es válido, procede con el envío del correo
        // Nota: En un entorno real, esto se manejaría con un backend.
        // Aquí, simulamos el envío y mostramos un mensaje de éxito.
        const mailtoLink = `mailto:sergioarbeysalinas2004@gmail.com?subject=Mensaje de Contacto de Sportify Store&body=Nombre: ${name}%0D%0ACorreo Electrónico: ${email}%0D%0AMensaje: ${message}`;
        
        window.location.href = mailtoLink; // Abre el cliente de correo predeterminado

        alert('¡Mensaje enviado exitosamente! Gracias por contactarnos.');
        form.reset(); // Limpia el formulario después del envío
    });
});
