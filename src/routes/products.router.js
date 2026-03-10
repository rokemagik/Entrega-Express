const { Router } = require("express");
const ProductManager = require("../managers/ProductManager");

const router = Router();
const manager = new ProductManager();

router.get("/", async (req, res) => {
  try {

    const products = await manager.getProducts()

    res.json(products)

  } catch (error){

    res.status(500).json({error:"Error al obtener productos"})

  }
});

router.get("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);

  const product = await manager.getProductById(id);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(product);
});

router.post("/", async (req, res) => {
  try {

    const product = req.body

    const newProduct = await manager.addProduct(product)

    const products = await manager.getProducts()

    const io = req.app.get("io")

    io.emit("updateProducts", products)

    res.status(201).json(newProduct)

  } catch (error){

    res.status(500).json({error:"Error al crear producto"})

  }
});

router.put("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const updatedProduct = await manager.updateProduct(id, req.body);

  if (!updatedProduct) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(updatedProduct);
});

router.delete("/:pid", async (req, res) => {
  try {

    const { pid } = req.params

    await manager.deleteProduct(pid)

    const products = await manager.getProducts()

    const io = req.app.get("io")

    io.emit("updateProducts", products)

    res.json({message:"Producto eliminado"})

  } catch (error){

    res.status(500).json({error:"Error al eliminar producto"})

  }
});

module.exports = router;