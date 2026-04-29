const { Router } = require("express");
const ProductModel = require("../models/Product");

const router = Router();

router.get("/", async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;

    limit = parseInt(limit);
    page = parseInt(page);

    let filter = {};

    if (query) {
      if (query === "true" || query === "false") {
        filter.status = query === "true";
      } else {
        filter.category = query;
      }
    }

    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    const products = await ProductModel.find(filter)
      .sort(sortOption)
      .limit(limit)
      .skip((page - 1) * limit);

    const totalProducts = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const baseUrl = "http://localhost:8080/api/products";

    const prevLink =
      page > 1
        ? `${baseUrl}?limit=${limit}&page=${page - 1}`
        : null;

    const nextLink =
      page < totalPages
        ? `${baseUrl}?limit=${limit}&page=${page + 1}`
        : null;

    res.json({
      status: "success",
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink,
      nextLink
    });

  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await ProductModel.findById(pid);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await ProductModel.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al crear producto" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      pid,
      req.body,
      { new: true } 
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const deleted = await ProductModel.findByIdAndDelete(pid);

    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

module.exports = router;