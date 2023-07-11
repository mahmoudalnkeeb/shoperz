const { InternalError } = require('../middlewares/errorhandler');
const orderService = require('../services/orders');
const Responser = require('../utils/responser');

const createOrder = async (req, res, next) => {
  try {
    let userId = req.userId;
    // method = 'card' | 'pypl' | 'cod'
    let { address, paymentMethodId, method } = req.body;
    let orderConfirmation = await orderService(userId, address, paymentMethodId, method);
    let responser = new Responser(201, 'order created successfully', orderConfirmation);
    responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal error', error));
  }
};

module.exports = { createOrder };
