//BUSCADOR PRODUCTOS
//Ejecutando funciones
document.getElementById("icon-search").addEventListener("click", mostrar_buscador);
document.getElementById("cover-ctn-search").addEventListener("click", ocultar_buscador);
//Declarando variables
const bars_search = document.getElementById("ctn-bars-search");
const cover_ctn_search = document.getElementById("cover-ctn-search");
const inputSearch = document.getElementById("inputSearch");
//Funcion para mostrar el buscador
function mostrar_buscador(){
    bars_search.style.top = "10rem";
    cover_ctn_search.style.display = "block";
}
//Funcion para ocultar el buscador
function ocultar_buscador(){
    bars_search.style.top = "-10rem";
    cover_ctn_search.style.display = "none";
    contenedorCarrito.style.marginLeft = "100%";
}
//Filtrar contenido desde el buscador 
const inputs = document.getElementById('inputSearch');
const searchFilters = () => {
    const texto = inputs.value.toLowerCase();
    d.querySelectorAll('h5').forEach( e => {
        const contenedor = e.parentElement;
        if(e.textContent.toLowerCase().indexOf(texto) !== -1){
            contenedor.parentElement.style.display = "block";
        } else {
            contenedor.parentElement.style.display = "none";
        }
    })
    
}
inputs.addEventListener('keyup', searchFilters);
