const fs = require("fs").promises;
const path = require("path");

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, "../data/products.json");
  }

  async getProducts() {
    const data = await fs.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async addProduct(product) {
    const products = await this.getProducts();

    const newId =
      products.length > 0
        ? products[products.length - 1].id + 1
        : 1;

    const newProduct = { id: newId, ...product };

    products.push(newProduct);

    await fs.writeFile(this.path, JSON.stringify(products, null, 2));

    return newProduct;
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();

    const index = products.findIndex(p => p.id === id);

    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updatedFields,
      id: products[index].id
    };

    await fs.writeFile(this.path, JSON.stringify(products, null, 2));

    return products[index];
  }

  async deleteProduct(pid) {
    const products = await this.getProducts()

    const newProducts = products.filter(p => p.id !== Number(pid))

    await fs.writeFile(
        this.path,
        JSON.stringify(newProducts, null, 2)
    )

    return { message: "Producto eliminado" }
  }
}

module.exports = ProductManager;