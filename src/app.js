const express = require("express")
const { engine } = require("express-handlebars")
const http = require("http")
const { Server } = require("socket.io")

const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")
const viewsRouter = require("./routes/views.router")

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static("./src/public"))


app.engine("handlebars", engine())
app.set("view engine","handlebars")
app.set("views","./src/views")


app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)


const server = http.createServer(app)
const io = new Server(server)

app.set("io", io)


io.on("connection", async (socket)=>{

    console.log("Cliente conectado")

    socket.on("disconnect", ()=>{
        console.log("Cliente desconectado")
    })

})


const PORT = 8080

server.listen(PORT,()=>{
    console.log(`Servidor escuchando en puerto ${PORT}`)
})