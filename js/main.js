// Variables
const menu = document.querySelector('#menu');
// Controlar el contenido del carrito en el localStorage, en caso que no esté instanciado previamente se instancia como un array vacio
let carrito = JSON.parse(localStorage.getItem('carrito')) ?? [];
const btnVaciar = document.querySelector('.btnVaciar');
const containerCarrito = document.querySelector('#containerCarrito');
const divCarrito = document.querySelector('#carrito');

// Eventos
// Agregar producto al carrito
menu.addEventListener('click', (e) => {
    e.preventDefault();
    // Verificar que se haga click en el target con la clase .agregar-carrito
    if(e.target.classList.contains('agregar-carrito')) {
        crearProducto(e.target.parentElement);
    }
});

// Eliminar producto
btnVaciar.addEventListener('click', (e) => {
    e.preventDefault();

    // Vaciar el carrito
    carrito = [];
    // Eliminar el carrito del localStorage
    localStorage.removeItem('carrito');
    // Eliminar del HTML
    limpiarHTML(divCarrito);
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

    // Verificar si ya existe el producto en el carrito
    const index = carrito.findIndex( produc => produc.id === id);

    // Si existe se le aumenta la cantidad del producto. Sino existe se agrega el producto
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
    imprimirMensaje('Se agrego un producto correctamente');

    mostrarCarrito();
}

// Mostrar los productos del carrito en el HTML
const mostrarCarrito = () => {
    limpiarHTML(divCarrito);

    // Verificando si el carrito tiene productos
    if(carrito) {
        // Creando un div para cada producto del carrito
        carrito.forEach( (producto) => {
            const { nombre, cantidad, precio, id, imagen } = producto

            // Creación del div
            const div = document.createElement('div');
            // Estableciendole el id
            div.dataset.id = producto.id;
    
            // Creación del nombre del producto
            const nombreH3 = document.createElement('h3');
            nombreH3.innerHTML = `<span class="text-uppercase">Producto:</span> ${nombre}`;
            nombreH3.classList.add('fs-5', 'py-2');
            div.appendChild(nombreH3);
    
            // Creación de la cantidad del producto
            const cantidadDiv = document.createElement('div');
            cantidadDiv.innerHTML = `<span class="text-uppercase">Cantidad:</span> ${cantidad}`;
            cantidadDiv.classList.add('fs-6');
            div.appendChild(cantidadDiv);
    
            // Creación del precio del producto
            const precioDiv = document.createElement('div');
            precioDiv.innerHTML = `<span class="text-uppercase">Precio</span> (con iva): $${calcularPrecioConIva(precio, cantidad).toFixed(2)}`
            precioDiv.classList.add('fs-6', 'p-2');
            div.appendChild(precioDiv);
    
            // Creación de la imagen del producto
            const imagenImg = document.createElement('img');
            imagenImg.src = imagen;
            div.appendChild(imagenImg);
    
            const divBtns = document.createElement('div');
            divBtns.classList.add('d-flex', 'justify-content-between');
            divBtns.id = 'divBtn';
            div.appendChild(divBtns);

            // Agregando un botón para eliminar el producto
            const btnEliminar = document.createElement('button');
            btnEliminar.innerHTML = `Eliminar &times`;
            btnEliminar.classList.add('btn', 'btn-outline-danger', 'me-3', 'd-flex', 'mt-2');
            divBtns.appendChild(btnEliminar);

            // Agregando un botón para editar la cantidad del producto
            const btnEditar = document.createElement('button');
            btnEditar.innerHTML = `Editar <i class="fas fa-edit m-auto ms-1"></i>`;
            btnEditar.classList.add('btn', 'btn-outline-info', 'mr-2', 'd-flex', 'mt-2');
            divBtns.appendChild(btnEditar);

            // Eliminar producto según id
            btnEliminar.onclick = () => eliminarProducto(id);

            // Editar el producto según id
            btnEditar.onclick = () => editarProducto(div);
    
            // Incorporando el div del producto al HTML
            div.classList.add('box-grid', 'text-center');
            document.querySelector('#carrito').appendChild(div);
        });

        // Mostrar el total del carrito en el HTML
        mostrarTotalCarrito();

    } else {
        // Ocultar carrito al no tener elementos
        divCarrito.classList.add('d-none');
    }
}

// Mostrar el total del carrito
const mostrarTotalCarrito = () => {
    const totalCarrito = (carrito.reduce( (acc, {precio, cantidad}) => acc + calcularPrecioConIva(precio, cantidad), 0)).toFixed(2);
    
    if(totalCarrito > 0) {
        // Activar carrito
        containerCarrito.classList.remove('d-none');

        const divTotal = document.querySelector('#total');

        // Hacer que solo haya un total actualizado
        limpiarHTML(divTotal);

        const total = document.createElement('div');
        total.innerHTML = `El precio total es: $${totalCarrito}`;
        total.classList.add('box-total', 'text-center');
        divTotal.appendChild(total);

    } else {
        // Ocultar containerCarrito en el HTML cuando no haya productos en el carrito
        containerCarrito.classList.add('d-none');
    }
}

// Limpiar el HTML
const limpiarHTML = (container) => {
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

// Eliminar productos según id
const eliminarProducto = (id) => {
    carrito = carrito.filter( (producto) => producto.id !== id);

    // Mostrar alerta al eliminar un elemento del carrito
    imprimirMensaje('Se elimino un elemento del carrito exitosamente', false);

    // Actualizar localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

// Editar un solo producto a la vez
const editarProducto = (div) => {
    const existeInput = document.getElementById('inputNumber');

    // Controlar que no se esté editando otro producto
    if(!existeInput) {
        // Limpiar los btn's de eliminar y editar
        div.querySelector('#divBtn').remove();

        // Creación del container de los btn's
        const divBtns = document.createElement('div');
        divBtns.classList.add('d-flex', 'justify-content-between');
        divBtns.id = 'divBtn';
        div.appendChild(divBtns);
    
        // Creación del btn cancelar
        const btnCancelar = document.createElement('button');
        btnCancelar.innerHTML = `Cancelar`;
        btnCancelar.classList.add('btn', 'btn-outline-danger', 'me-3', 'd-flex', 'mt-2');
        divBtns.appendChild(btnCancelar);
    
        // Creación del btn aceptar
        const btnAceptar = document.createElement('button');
        btnAceptar.innerHTML = `Aceptar`;
        btnAceptar.classList.add('btn', 'btn-outline-primary', 'd-flex', 'mt-2');
        divBtns.appendChild(btnAceptar);
    
        // Creación del input para editar la cantidad
        const divContainer = document.createElement('div');
        divContainer.classList.add('input-group', 'mt-2');
        divContainer.innerHTML = `
            <span class="input-group-text">Cantidad</span>
            <input type="number" class="form-control" id="inputNumber">
        `;
        div.appendChild(divContainer);
    
        // Evento del btnCancelar, cargar el carrito
        btnCancelar.onclick = () => mostrarCarrito();
    
        // Evento del btnAceptar, verificar la actualización y actualizar el producto
        btnAceptar.addEventListener('click', actualizarConBtn);
    
        // Evento del input, verificar la actualización y actualizar el producto
        document.querySelector('#inputNumber').addEventListener('keyup', actualizarConInput);

    } else {
        // Mostrar alerta con aviso de edición de otro producto
        imprimirMensaje('Se está editando otro producto. Termine de editar para continuar', false);
    }
}

// Actualizar el producto presionando Enter en el input
const actualizarConInput = (e) => {
    // Comprobar que se pulso Enter
    if(e.key === 'Enter') {
        // Verificar que la cantidad ingresada sea mayor a 0
        if(e.target.value > 0) {
            const producto = e.target.parentElement.parentElement;

            actualizarCantidad(producto);
            return;
        }

        // Mostrar alerta de cantidad no valida
        imprimirMensaje('Cantidad no valida', false);
    }
}

const actualizarConBtn = (e) => {
    const producto = e.target.parentElement.parentElement;
    const input = producto.querySelector('#inputNumber');

    // Verificar que la cantidad ingresada sea mayor a 0
    if(input.value > 0) {
        actualizarCantidad(producto);
        return;
    } 

    // Mostrar alerta de cantidad no valida
    imprimirMensaje('Cantidad no valida', false);
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

// Actualizar la cantidad del producto
const actualizarCantidad = (producto) => {
    // Agarra cantidad porque es el primer div
    const cantidadAActualizar = producto.querySelector('div');
    const idProductoActualizar = parseInt(producto.getAttribute('data-id'));
    const cantidadNueva = parseInt(producto.querySelector('#inputNumber').value);
    
    cantidadAActualizar.innerHTML = `<span class="text-uppercase">Cantidad:</span> ${cantidadNueva}`;

    const index = carrito.findIndex( ({ id }) => id === idProductoActualizar);

    carrito[index].cantidad = cantidadNueva;
    localStorage.setItem('carrito', JSON.stringify(carrito));

    mostrarCarrito();
}

// Calcular el precio del producto con iva incluido
const calcularPrecioConIva = (precio, cantidad) => {
    return precio * cantidad * 1.21;
}