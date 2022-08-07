// Variables
const menu = document.querySelector('#menu');
let carrito = JSON.parse(localStorage.getItem('carrito'));
const btnVaciar = document.querySelector('.btnVaciar');
const containerCarrito = document.querySelector('#containerCarrito');

// Eventos
// Agregar producto al carrito
menu.addEventListener('click', (e) => {
    e.preventDefault();

    if(e.target.classList.contains('agregar-carrito')) {
        crearProducto(e.target.parentElement);
    }
});

// Eliminar producto
btnVaciar.addEventListener('click', (e) => {
    e.preventDefault();

    // Mostrar alerta al vaciar el carrito
    imprimirMensaje('Se vacio el carrito exitosamente', false);
    // Vaciar el carrito
    carrito = [];
    // Vaciar el localStorage
    localStorage.clear();
    // Eliminar del HTML
    limpiarCarrito();
    // Desabilitar el carrito
    containerCarrito.classList.add('d-none');
});

// Cargar el carrito en caso de tener productos en el localStorage al inciar el sitio
document.addEventListener('DOMContentLoaded', () => {
    mostrarCarrito();
});

// Clases
class Producto {
    constructor(nombre, precio, cantidad, id, imagen) {
        this.nombre = nombre;
        this.precio = parseFloat(precio);
        this.cantidad = parseInt(cantidad);
        this.id = parseInt(id);
        this.imagen = imagen;
    }

    // calcularPrecioConIva() {
    //     return this.precio * 1.21 * this.cantidad;
    // }
}

// Crear producto valiendo su cantidad
const crearProducto = (infoProducto) => {

    const nombre = infoProducto.querySelector('h3').textContent;
    const precio = infoProducto.querySelector('div span').textContent;
    const id = infoProducto.querySelector('a').getAttribute('data-id');
    const cantidad = 1;
    const imagen = infoProducto.querySelector('img').src;

    // Creando el objeto producto
    const producto = new Producto(nombre, precio, cantidad, id, imagen);

    // Si el carrito esta vacio que se instancia como un array vacio y posteriormente cargua los productos
    switch (carrito) {
        case null:
            carrito = [];
        default:
            // Recorrer el array buscando el índice del producto
            const index = carrito.findIndex( produc => produc.id === producto.id);
    
            if(index !== -1) {
                // Actualizar la cantidad del producto
                carrito[index].cantidad++;
                // Actualizar en el localStorage
                localStorage.setItem('carrito', JSON.stringify(carrito));
        
            } else {
                // Actualizando el array
                carrito = [...carrito, producto];
                // Agregar al localStorage
                localStorage.setItem('carrito', JSON.stringify(carrito));
            }
            
            // Mostrar alerta al agregar el producto
            imprimirMensaje('Se agrego un elemento al carrito exitosamente');
            mostrarCarrito();
    }
}

// Mostrar los productos del carrito en el HTML
const mostrarCarrito = () => {
    
    limpiarCarrito();

    // Verificando si el carrito tiene productos
    if(carrito) {
        // Creando un div para cada producto del carrito
        carrito.forEach( (producto) => {
            // Creación del div
            const div = document.createElement('div');
            // Estableciendole el id
            div.dataset.id = producto.id;
    
            // Creación del nombre del producto
            const nombre = document.createElement('h3');
            nombre.innerHTML = `<span class="text-uppercase">Producto:</span> ${producto.nombre}`;
            nombre.classList.add('fs-5', 'py-2');
            div.appendChild(nombre);
    
            // Creación de la cantidad del producto
            const cantidad = document.createElement('div');
            cantidad.innerHTML = `<span class="text-uppercase">Cantidad:</span> ${producto.cantidad}`;
            cantidad.classList.add('fs-6');
            div.appendChild(cantidad);
    
            // Creación del precio del producto
            const precio = document.createElement('div');
            precio.innerHTML = `<span class="text-uppercase">Precio</span> (con iva): $${calcularPrecioConIva(producto.precio, producto.cantidad).toFixed(2)}`
            precio.classList.add('fs-6', 'p-2');
            div.appendChild(precio);
    
            // Creación de la imagen del producto
            const imagen = document.createElement('img');
            imagen.src = producto.imagen;
            div.appendChild(imagen);
    
            // Agregando un botón para eliminar el producto
            const btnEliminar = document.createElement('button');
            btnEliminar.innerHTML = `Eliminar &times`;
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2', 'd-flex');
            div.appendChild(btnEliminar);
    
            // Eliminar producto según id
            btnEliminar.onclick = () => eliminarProducto(producto.id);
    
            // Incorporando el div del producto al HTML
            div.classList.add('box-grid', 'text-center');
            document.querySelector('#carrito').appendChild(div);
        });

        // Mostrar el total del carrito en el HTML
        mostrarTotalCarrito();

    } else {
        // Ocultar carrito al no tener elementos
        containerCarrito.classList.add('d-none');
    }
}

// Mostrar el total del carrito
const mostrarTotalCarrito = () => {

    const totalCarrito = (carrito.reduce( (acc, producto) => acc + calcularPrecioConIva(producto.precio, producto.cantidad), 0)).toFixed(2);
    
    if(totalCarrito > 0) {
        // Activar carrito
        containerCarrito.classList.remove('d-none');

        const divTotal = document.querySelector('#total');

        // Hacer que solo haya un total actualizado
        if(divTotal.firstChild) {
            while(divTotal.firstChild) {
                divTotal.removeChild(divTotal.firstChild);
            }
        }

        const total = document.createElement('div');
        total.innerHTML = `El precio total es: $${totalCarrito}`;
        total.classList.add('box-total', 'text-center');
        document.querySelector('#total').appendChild(total);
    }
}

// Limpiar carrito para no encontrar duplicados
const limpiarCarrito = () => {
    const contenedorCarrito = document.querySelector('#carrito');
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

// Eliminar productos según id
const eliminarProducto = (id) => {
    carrito = carrito.filter( (producto) => producto.id !== id);
    // Actualizar localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Mostrar alerta al eliminar un elemento del carrito
    imprimirMensaje('Se elimino un elemento del carrito exitosamente', false);
    mostrarCarrito();
}

// Mostrar alerta
const imprimirMensaje = (mensaje, tipo = true) => {
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12', 'mt-3');

    // Agregar una clase en base al tipo del mensaje
    if(tipo) {
        divMensaje.classList.add('alert-success');
    } else {
        divMensaje.classList.add('alert-danger');
    }

    // Contenido del mensaje
    divMensaje.textContent = mensaje;

    // Agregando al DOM
    menu.appendChild(divMensaje);

    // Eliminar la alerta después de 2 segundos 
    setTimeout( () => {
        divMensaje.remove();
    }, 2000);
}

// Calcular el precio del producto con iva incluido
const calcularPrecioConIva = (precio, cantidad) => {
    return precio * cantidad * 1.21;
}