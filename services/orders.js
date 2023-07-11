const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { payWithStripe, payWithStripeConfirm } = require('./payments');

const orderService = async (userId, addressId, paymentMethodId, method) => {
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
    /* 
      TODO: 
          wait for payment in case of not cash_on_delivery.
          when payment success change payment.status to 'success' in case of fail 'failed'
          order.status will be 'awaiting_shipment' in case of success in payment or cash_on_delivery
          or 'cancelled' in case of failed
    */
    if (method == 'card') {
      let { id, status } = await payWithStripe(order.discountedTotal * 100, order._id);
      if (status !== 'succeeded') {
        order.status = 'cancelled';
        order.payment.status = 'failed';
        order.payment.transaction_id = id;
        await order.save();
        return { status, orderId: order._id };
      }
      let confirmation = await payWithStripeConfirm(id, paymentMethodId);
      if (confirmation.status !== 'succeeded') {
        order.status = 'cancelled';
        order.payment.status = 'failed';
        order.payment.transaction_id = confirmation.id;
        await order.save();
        return { status, orderId: order._id };
      }
      order.status = 'awaiting_fulfillment';
      order.payment.status = 'success';
      order.payment.transaction_id = id;
      return { status: confirmation.status, orderId: order._id };
    }
  } catch (error) {
    throw error;
  }
};

module.exports = orderService;
