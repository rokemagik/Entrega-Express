const { Router } = require("express")
const ProductManager = require("../managers/ProductManager")

const router = Router()

const manager = new ProductManager("./src/data/products.json")

router.get("/", async (req,res)=>{

    const products = await manager.getProducts()

    res.render("home",{products})

})


router.get("/realtimeproducts", async (req,res)=>{

    const products = await manager.getProducts()

    res.render("realTimeProducts",{products})

})

module.exports = router