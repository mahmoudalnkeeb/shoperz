const mongoose = require('mongoose');

class OrderProductClass {}

const orderProductSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

orderProductSchema.loadClass(OrderProductClass);

let OrderProduct = mongoose.model('OrderProduct', orderProductSchema);

module.exports = OrderProduct;
