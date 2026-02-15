const fs = require("fs").promises;

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return []; // si el archivo no existe devuelve array vacío
    }
  }

  async createCart() {
    const carts = await this.getCarts();

    const newCart = {
      id: carts.length ? carts[carts.length - 1].id + 1 : 1,
      products: []
    };

    carts.push(newCart);

    await fs.writeFile(
      this.path,
      JSON.stringify(carts, null, 2)
    );

    return newCart;
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();

    const cart = carts.find(c => c.id == cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const productInCart = cart.products.find(p => p.product == pid);

    if (productInCart) {
        productInCart.quantity++;
    } else {
        cart.products.push({
        product: Number(pid),
        quantity: 1
        });
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));

    return cart;
    }

    async getCarts() {
        const data = await fs.readFile(this.path, "utf-8");
        return JSON.parse(data);
    }

    async getCartById(cid) {
        const carts = await this.getCarts();

        const cart = carts.find(c => c.id === Number(cid));

        if (!cart) throw new Error("Carrito no encontrado");

        return cart.products;
    }
}

module.exports = CartManager;