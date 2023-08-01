const { PaymentFailedError } = require('../middlewares/errorhandler');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { payWithStripe } = require('./payments');

const orderService = async (userId, addressId, method) => {
  try {
    let methods = {
      card: 'credit_card',
      pypl: 'paypal',
      cod: 'cash_on_delivery',
    };
    // get cart by userId
    let userCart = await Cart.findOne({ userId });
    let cartTotal = await userCart.getCartTotal();
    let cartTotalDiscounted = await userCart.getCartDiscountedTotal();
    // use cart data to create new order
    let order = new Order({
      userId,
      addressId,
      totalPrice: cartTotal,
      discountedTotal: cartTotalDiscounted,
      status: method == 'cod' ? 'awaiting_fulfillment' : 'pending',
      payment: {
        method: methods[method],
        status: method == 'cod' ? 'cash_on_delivery' : 'pending',
      },
    });
    await order.save();
    return order;
  } catch (error) {
    throw error;
  }
};

module.exports = orderService;
