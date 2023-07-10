const Cart = require('../models/Cart');
const Order = require('../models/Order');

const createOrderFromUserCart = async (userId, address, paymentMethod) => {
  try {
    // get cart by userId
    let userCart = await Cart.findOne({ userId });
    let cartTotal = await userCart.getCartTotal();
    let cartTotalDiscounted = await userCart.getCartDiscountedTotal();
    // use cart data to create new order
    let order = new Order({
      userId,
      totalPrice: cartTotal,
      discountedTotal: cartTotalDiscounted,
      payment: {
        method: paymentMethod,
        status: paymentMethod == 'cash_on_delivery' ? 'cash_on_delivery' : 'pending',
      },
    });
    /* 
      TODO: 
          wait for payment in case of not cash_on_delivery.
          when payment success change payment.status to 'success' in case of fail 'failed'
          order.status will be 'awaiting_shipment' in case of success in payment or cash_on_delivery
          or 'cancelled' in case of failed
    */
  } catch (error) {
    throw error;
  }
};
