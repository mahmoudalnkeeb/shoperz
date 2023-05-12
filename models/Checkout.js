const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Checkout = mongoose.model('Checkout', checkoutSchema);

module.exports = Checkout;
