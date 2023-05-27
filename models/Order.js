const mongoose = require('mongoose');
class OrderClass {
  static async createOrder(addressId, paymentMethod , cart) {
    try {
      let userId = cart.userId;
      let products = cart.items;
      let totalPrice = cart.getCartTotal();
      let discountedTotal = cart.getCartDiscountedTotal();
      let payment;
      if (paymentMethod == 'cash_on_delivery') {
        payment = {
          method: paymentMethod,
          status: 'cash_on_delivery',
        };
        let order = new this({
          userId,
          addressId,
          products,
          totalPrice,
          discountedTotal,
          payment,
        });
        return await order.save();
      }
      // wait for payment
      /*
        let paymentProcess = pay(discountedTotal)
        payment = {
          method: paymentMethod,
          status: paymentProcess.status
          transaction_id: paymentProcess.transaction_id
        };
      */
      // ----

      let order = new this({
        userId,
        addressId,
        products,
        totalPrice,
        discountedTotal,
        payment,
      });
      return await order.save();
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
    products: {
      type: [
        {
          product_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
        },
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'awaiting_fulfillment', 'awaiting_shipment', 'shipped', 'completed', 'cancelled'],
      required: true,
      default: 'pending',
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
          default: 'cash_on_delivery',
        },
        transaction_id: {
          type: String,
        },
        status: {
          type: String,
          enum: ['pending', 'cash_on_delivery', 'success', 'failed'],
          default: 'pendeing',
        },
      },
    },
  },

  { timestamps: true }
);

orderSchema.loadClass(OrderClass);

let Order = mongoose.model('Order', orderSchema);

module.exports = Order;
