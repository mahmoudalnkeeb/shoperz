/* deprecated
const { PaymentFailedError } = require('../middlewares/errorhandler');
const Order = require('../models/Order');
const { payWithStripe } = require('../services/payments');
const Responser = require('../utils/responser');

const createIntent = async (req, res, next) => {
  try {
    let { orderId } = req.body;
    let order = await Order.findById(orderId);
    let intent = await payWithStripe(order.discountedTotal, orderId);
    if (intent.status !== 'succeeded') {
      order.status = 'cancelled';
      order.payment.status = 'failed';
      order.payment.transaction_id = id;
      await order.save();
      throw new PaymentFailedError(
        intent.cancellation_reason || 'payment failed',
        intent.cancellation_reason || 'payment failed'
      );
    }
    let responser = new Responser(201, 'payment intent created successfully', {
      status: intent.status,
      clientSecret: intent.client_secret,
      orderId,
    });
    responser.respond(res);
  } catch (error) {
    next(error);
  }
};
*/

const { stripePublisableKey } = require('../configs/env');
const Responser = require('../utils/responser');

const getPublisherKey = (req, res, next) => {
  try {
    const responser = new Responser(200, 'publishable key sent', { pk: stripePublisableKey });
    responser.respond(res);
  } catch (error) {
    next(error);
  }
};

module.exports = { getPublisherKey };
