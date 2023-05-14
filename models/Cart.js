const mongoose = require('mongoose');

class CartClass {
  async addItem(productId, quantity) {
    try {
      const existingItemIndex = this.items.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );
      if (existingItemIndex !== -1) {
        throw new Error('Product already exists in the cart');
      }
      await this.updateOne({ $push: { items: { productId, quantity } } });
    } catch (error) {
      throw error;
    }
  }

  async removeItem(productId) {
    await this.updateOne({ $pull: { items: { productId } } });
  }

  async updateItemQuantity(productId, quantity) {
    await this.updateOne(
      { 'items.productId': productId },
      { $set: { 'items.$.quantity': quantity } }
    );
  }

  async getCartTotal() {
    await this.populate('items.productId').execPopulate();
    let total = 0;
    for (const item of this.items) {
      total += await item.getSubtotal();
    }
    return total;
  }

  // statics
  //create user cart

  static async createUserCart(userId) {
    let cart = new this({ userId });
    let userCart = await cart.save();
    return userCart;
  }
}

class CartItemClass {
  async getSubtotal() {
    await this.populate('productId').execPopulate();
    return this.quantity * this.productId.price;
  }
}

const cartItemSchema = new mongoose.Schema(
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
  { timestamps: true }
);

cartItemSchema.loadClass(CartItemClass);

const CartItem = mongoose.model('CartItem', cartItemSchema);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [CartItem.schema],
      default: [],
    },
  },
  { timestamps: true }
);

cartSchema.loadClass(CartClass);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = { Cart, CartItem };
