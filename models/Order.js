const mongoose = require('mongoose');
const OrderProduct = require('./OrderProduct');

class OrderClass {
  async addProductsFromCart(cart) {
    try {
      const orderProducts = cart.items.map((item) => ({
        order_id: this._id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      await OrderProduct.insertMany(orderProducts);

      if (this.status !== 'pending') {
        this.status = 'pending';
        await this.save();
      }

      return this;
    } catch (error) {
      throw error;
    }
  }
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountedTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    payment: {
      type: {
        method: {
          type: String,
          enum: ['credit_card', 'paypal', 'cash_on_delivery'],
        },
        transaction_id: {
          type: String,
        },
        status: {
          type: String,
          enum: ['pending', 'success', 'failed'],
        },
      },
    },
  },

  { timestamps: true }
);

orderSchema.loadClass(OrderClass);

let Order = mongoose.model('Order', orderSchema);

module.exports = Order;
