const { Router } = require("express");
const CartModel = require("../models/Cart");
const ProductModel = require("../models/Product");

const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = await CartModel.create({ products: [] });
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear carrito" });
  }
});

router.get("/", async (req, res) => {
  try {
    const carts = await CartModel.find().populate("products.product");
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener carritos" });
  }
});


router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await CartModel.findById(cid).populate("products.product");

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener carrito" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const product = await ProductModel.findById(pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no existe" });
    }

    const index = cart.products.findIndex(
      p => p.product.toString() === pid
    );

    if (index !== -1) {
      cart.products[index].quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar producto" });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);

    cart.products = cart.products.filter(
      p => p.product.toString() !== pid
    );

    await cart.save();

    res.json({ message: "Producto eliminado del carrito" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await CartModel.findById(cid);

    const product = cart.products.find(
      p => p.product.toString() === pid
    );

    if (!product) {
      return res.status(404).json({ error: "Producto no está en el carrito" });
    }

    product.quantity = quantity;

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar cantidad" });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const updatedCart = await CartModel.findByIdAndUpdate(
      cid,
      { products: req.body },
      { new: true }
    );

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar carrito" });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    await CartModel.findByIdAndUpdate(cid, { products: [] });

    res.json({ message: "Carrito vaciado" });
  } catch (error) {
    res.status(500).json({ error: "Error al vaciar carrito" });
  }
});


module.exports = router;