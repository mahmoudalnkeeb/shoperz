const mongoose = require('mongoose');
class OrderClass {}

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
    // what should be passed in payment process
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
