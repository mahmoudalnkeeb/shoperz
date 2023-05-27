const { InternalError } = require('../middlewares/errorhandler');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Responser = require('../utils/responser');

const createOrder = async (req, res, next) => {
  try {
    let userId = req.userId;
    let { addressId, paymentMethod } = req.body;
    let userCart = await Cart.findOne({ userId });
    let userOrder = await User.createOrder(addressId, paymentMethod, userCart);
    let responser = new Responser(201, 'order created successfully', { userOrder });
    responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal error', error));
  }
};

module.exports = { createOrder };
