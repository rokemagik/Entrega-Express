const socket = io()

socket.on("updateProducts",(products)=>{

    const list = document.getElementById("productList")

    list.innerHTML=""

  products.forEach(product => {

    const li = document.createElement("li")

    li.innerText = `${product.title} - $${product.price}`

    list.appendChild(li)

  })

})


socket.on("updateProducts",(products)=>{

    const list = document.getElementById("productList")

    list.innerHTML = ""

    products.forEach(product => {

        const li = document.createElement("li")

        li.innerText = `${product.title} - $${product.price}`

        list.appendChild(li)

    })

})