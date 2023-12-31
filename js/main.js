const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})

const fetchData = async () => {
    try {
        const res = await fetch('./data/api.json')
        const data = await res.json()
        pintarCards(data)
    } catch (error) {
        console.error(error)
    }
}

const pintarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id


        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })

    cards.appendChild(fragment)
}

const addCarrito = e => {
    const buy = e.target.classList.contains('btn-dark')
    if (buy){
        setCarrito(e.target.parentElement)
    }

    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        price: objeto.querySelector('p').textContent,
        quantity: 1,
    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.quantity = carrito[producto.id].quantity += 1
    }

    carrito[producto.id] = {...producto}
    pintarCarrito()

    localStorage.setItem('carrito', JSON.stringify(carrito))

}


const pintarCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.quantity
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.quantity * producto.price

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    pintarFooter()
}


const pintarFooter = () => {
    footer.innerHTML = ''

    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacio - comience a comprar! </th>`
        return
    }

    const nCantidad = Object.values(carrito).reduce( (acc,{quantity}) => acc+quantity,0 )
    const nPrecio = Object.values(carrito).reduce( (acc,{quantity,price}) => acc + quantity * price, 0)
    

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio


    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const btnEliminar = document.getElementById('vaciar-carrito')
    btnEliminar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}


const btnAccion = e => {
   const increase =  e.target.classList.contains('btn-info')
   const decrease =  e.target.classList.contains('btn-danger')
   const dataId = e.target.dataset.id

   if(increase){
    const producto = carrito[dataId]
    console.log(carrito)
    producto.quantity++
    carrito[dataId] = {...producto}
    pintarCarrito()
   }

   if(decrease){
    const producto = carrito[dataId]
    console.log(carrito)
    producto.quantity--
    if(producto.quantity === 0){
        delete carrito[dataId]
    }
    pintarCarrito()
   }

   e.stopPropagation()
}