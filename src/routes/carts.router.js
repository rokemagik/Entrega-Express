const { Router } = require("express");
const CartManager = require("../managers/CartManager");
const ProductManager = require("../managers/ProductManager");

const router = Router();
const manager = new CartManager("./src/data/carts.json");
const productManager = new ProductManager("./src/data/products.json");

router.post("/", async (req, res) => {
  const cart = await manager.createCart();
  res.status(201).json(cart);
});

router.get("/", async (req, res) => {
  try {
    const carts = await manager.getCarts();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener carritos" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const products = await manager.getCartById(cid);
    res.json(products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    // 🔥 VALIDACIÓN NUEVA
    const product = await productManager.getProductById(parseInt(pid));

    if (!product) {
      return res.status(404).json({
        error: "El producto no existe"
      });
    }

    const cart = await manager.addProductToCart(cid, pid);

    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;