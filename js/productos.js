document.addEventListener('DOMContentLoaded', function() {
    const productGrid = document.querySelector('.product-grid');

    // Hacemos una petición a nuestra nueva API
    fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            productGrid.innerHTML = ''; // Limpiamos los productos hardcodeados
            const products = data.data;

            products.forEach(product => {
                // Creamos el HTML para cada producto dinámicamente
                const productItem = document.createElement('div');
                productItem.className = 'product-item';
                productItem.innerHTML = `
                    <img src="${product.imageUrl}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="btn">Añadir al Carrito</button>
                `;
                productGrid.appendChild(productItem);
            });
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
            productGrid.innerHTML = '<p>No se pudieron cargar los productos. Inténtalo de nuevo más tarde.</p>';
        });
});