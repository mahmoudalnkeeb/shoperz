const mongoose = require('mongoose');

class OrderClass {}

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },
  },

  { timestamps: true }
);

orderSchema.loadClass(OrderClass);

let Order = mongoose.model('Order', orderSchema);

module.exports = Order;
