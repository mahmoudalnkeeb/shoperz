const mongoose = require('mongoose');
const { NotFoundError } = require('../middlewares/errorhandler');

class CartClass {
  async addItem(productId, quantity) {
    try {
      const existingItemIndex = this.items.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );
      if (existingItemIndex !== -1) {
        throw new Error('Product already exists in the cart');
      }
      this.items.push({ productId, quantity });
      this.save();
      return this;
    } catch (error) {
      throw error;
    }
  }

  async removeItem(productId) {
    await this.updateOne({ $pull: { items: { productId } } });
  }

  async updateItemQuantity(productId, quantity) {
    try {
      const itemIndex = this.items.findIndex((item) => item.productId.toString() === productId.toString());

      if (itemIndex !== -1) {
        this.items[itemIndex].quantity = quantity;
      } else throw new NotFoundError('cart item not found');

      await this.save();

      return this;
    } catch (error) {
      // Handle the error appropriately
      console.error('Error updating item quantity:', error);
      throw error;
    }
  }

  async getCartTotal() {
    let products = await this.populate('items.productId');
    // cuz this promise above returns null inside productId
    const cleanProducts = products.items.filter((prod) => prod.productId !== null);
    //
    const totalPrice = cleanProducts.reduce((prev, curr) => prev + curr.productId.price, 0);
    const totalQuantity = cleanProducts.reduce((prev, curr) => prev + curr.quantity, 0);
    const total = totalPrice + totalQuantity;
    return total;
  }

  async getCartDiscountedTotal() {
    let products = await this.populate('items.productId');
    // cuz this promise above returns null inside productId
    const cleanProducts = products.items.filter((prod) => prod.productId !== null);
    //
    let discountedTotal = 0;
    for (const item of cleanProducts) {
      let discountedPrice = item.productId.price * ((100 - item.productId.discount) / 100);
      discountedTotal += discountedPrice * item.quantity;
    }
    return +discountedTotal.toFixed(2);
  }
  // statics
  //create user cart

  static async createUserCart(userId) {
    let cart = new this({ userId });
    let userCart = await cart.save();
    return userCart;
  }
}

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

cartSchema.loadClass(CartClass);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
