const { Router } = require("express");
const ProductModel = require("../models/Product");
const CartModel = require("../models/Cart");

const router = Router();

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/products", async (req, res) => {
  try {
    const products = await ProductModel.find().lean();

    res.render("products", { products });
  } catch (error) {
    res.status(500).send("Error al cargar productos");
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await CartModel.findById(cid)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("cart", { cart });
  } catch (error) {
    res.status(500).send("Error al cargar carrito");
  }
});


module.exports = router;