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
    let userCart = await Cart.findOne({ userId }).populate(
      'items.productId',
      '_id name price discount deliveryCost'
    );
    let cartTotal = await Cart.getCartTotal(userCart.items);
    let cartTotalDiscounted = await Cart.getCartDiscountedTotal(userCart.items);
    // use cart data to create new order
    let order = new Order({
      userId,
      addressId,
      totalPrice: cartTotal,
      discountedTotal: cartTotalDiscounted,
      products: userCart.items.map((item) => {
        return { productId: item.productId, quantity: item.quantity };
      }),
      status: method == 'cod' ? 'awaiting_fulfillment' : 'pending',
      payment: {
        method: methods[method],
        status: method == 'cod' ? 'cash_on_delivery' : 'pending',
      },
    });
    await order.save();
    if (method == 'card') {
      let intent = await payWithStripe(cartTotalDiscounted, order._id);
      console.log(intent);
      if (intent.cancellation_reason) {
        order.status = 'cancelled';
        order.payment.status = 'failed';
        order.payment.transaction_id = intent.id;
        await order.save();
        throw new PaymentFailedError(
          intent.cancellation_reason || 'payment failed',
          intent.cancellation_reason || 'payment failed'
        );
      }
      return {
        clientSecret: intent.client_secret,
        order,
      };
    } else return order;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = orderService;
