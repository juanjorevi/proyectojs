//Variables para la funcion generar Cards
const items = document.getElementById("items");
const itemss = document.getElementById("itemss");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
//constante que crea un fragment vacio para adicionar nodos al DOM 
const fragment = document.createDocumentFragment();
//antes de cargar la pagina leer Json y si en el localstorage hay algo en el carrito y si existe imprimirlo.
document.addEventListener('DOMContentLoaded',() =>{
    fectchData();
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'));
        generarCarrito();
    }
    generarCards();
});
//leer JSON con productos;
const fectchData = async () => {
    try {
        const res = await fetch ('../json/data.json');
        const data = await res.json();
        //console.log(data);
        generarCards(data);
    } catch (err) {
        console.log(err);
    }
};
//Crear un carrito vacio (coleccion de objetos)
let carrito = {};
//Crear un unico evento para captar mis productos
items.addEventListener("click", e => {
    addCarrito(e);
});
//Funcion para generar las cards de productos
const generarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector("h5").textContent = producto.title;
        templateCard.querySelector("span").textContent = producto.precio;
        templateCard.querySelector("img").setAttribute("src", producto.img);
        templateCard.querySelector(".card").dataset.categoria = producto.categoria;
        //capto el boton y le doy al mismo el atributo "id" de mi producto
        templateCard.querySelector(".button-card").dataset.id = producto.id;
        //variable que clona los templates cards para generar mas de uno.
        const clone =templateCard.cloneNode(true);
        fragment.appendChild(clone);
    })
    items.appendChild(fragment);
};
//funcion de seleccionar mediante evento todo el elemento y enviarlo a otra funcion.
const addCarrito = e => {
    //capturo cada elemento de la card
    //console.log(e.target);
    //capturo el elemento de la card que contenga una clase en particular 
    //console.log(e.target.classList.contains("button-card"));
    if (e.target.classList.contains("button-card")){
        //con parentElement seleccionamos todo el div de la card.
        //console.log(e.target.parentElement);
        setCarrito(e.target.parentElement);
    }
    //para detener cualquier otro evento que genere en nuestros items, porque se heredan del contendor padre y queremos evitar toda esa informacion.
    e.stopPropagation();
};
//funcion de añadir cosas al carrito
const setCarrito = objeto => {
    //console.log(objeto);
    const producto = {
        id: objeto.querySelector(".button-card").dataset.id,
        title: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("span").textContent,
        cantidad: 1
    }
    //condicional para que aumenta la cantidad de producto seleccionado, es decir poder comprar mas de una unidad de un mismo producto.
    //El metodo hasOwnProperty devuelve un booleano que nos especifica si ese objeto tiene una propiedad especifica.
    if(carrito.hasOwnProperty(producto.id)){
        //indicamos que si la cantidad del producto sea igual a la cantidad el producto dentro del carrito sumandole uno (+1) para aumentar uno mas en el carrito.
        producto.cantidad = carrito[producto.id].cantidad + 1;
        //si el producto no existe, por defecto la cantidad es = 1
    }
    //empujamos al carrito el producto mediante su id (boton de la card)
    //los "..." es un spread opertar q nos permite adquirir toda la informacion del objeto.
    carrito[producto.id] = {...producto};
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Tu producto se agrego al carrito',
        showConfirmButton: false,
        timer: 1500
        })
    generarCarrito();
}
//imprimir cotenido nuevo en el carrito
const generarCarrito = () => {
    //console.log(carrito);
    //para que no se me sobreescriban los items a imprimir empiezo mi carrito siempre vacio para cada vez q ejecute esta funcion.
    itemss.innerHTML = "";
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector("th").textContent = producto.id;
        templateCarrito.querySelectorAll("td")[0].textContent = producto.title;
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
        templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio;
        const clone =templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    itemss.appendChild(fragment);
    imprimirFooter();
    //guardar en el local storage el carrito
    localStorage.setItem('carrito', JSON.stringify(carrito));
    imprimirNumeroCarrito();
}
//imprimir mi "footer o pie del carrito"
const imprimirFooter = () => {
    footer.innerHTML = "";
    if(Object.keys(carrito).length === 0){
        //object.keys devuelve un array con las propiedades de un objeto, lo utilizamos para saber si nuestro objeto carrito esta o no vacio.
        footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>'
        return;
    }
    const numCantidad = Object.values(carrito).reduce(( acc, {cantidad}) => acc + cantidad, 0);
    const numPrecio = Object.values(carrito).reduce(( acc, {cantidad, precio}) => acc + cantidad * precio, 0);
    //console.log(numCantidad);
    //console.log(numPrecio);
    templateFooter.querySelectorAll("td")[0].textContent = numCantidad;
    templateFooter.querySelector("span").textContent = numPrecio;
    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);
    const botonVaciar = document.getElementById("vaciar-carrito");
    botonVaciar.addEventListener("click", () => {
        carrito = {};
        generarCarrito();
    })
}
//dar funcionalidad a la botonera del footer del Carrito
itemss.addEventListener("click", e => {
    botonAccion(e);
})
const botonAccion = e => {
    //aumentar
    if(e.target.classList.contains('btn-info')){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto};
        generarCarrito();
    }
    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id];
        }
        generarCarrito();
    }
    e.stopPropagation();
}
//Sumar numero de elementos de mi carrito 
const numeroCarrito = document.querySelector('.numero-carrito');
const imprimirNumeroCarrito = () => {
    const numCantidad = Object.values(carrito).reduce(( acc, {cantidad}) => acc + cantidad, 0);
    numeroCarrito.textContent = numCantidad;
}
//desplazar carrito 
const contenedorCarrito = document.querySelector('.container-carrito');
function mostrarCarrito () {
    contenedorCarrito.style.marginLeft = "60%";
    cover_ctn_search.style.display = "block";
};
/*Filtrar contenido*/
const d = document;
function mostrarTodo(){
    d.querySelectorAll('.card').forEach(e=>{
        e.style.display = "block";
    })
}
function filtrar (filtro){
    d.querySelectorAll('.card').forEach(e => {
        e.style.display = "block";
        if(e.dataset.categoria != filtro){
            e.style.display="none";
        }
    });
};
