const { isValidObjectId } = require('mongoose');
const { InternalError, ValidationError, NotFoundError } = require('../middlewares/errorhandler');
const Order = require('../models/Order');
const orderService = require('../services/orders');
const Responser = require('../utils/responser');

const createOrder = async (req, res, next) => {
  try {
    let userId = req.userId;
    // method = 'card' | 'pypl' | 'cod'
    let { address, method } = req.body;
    let order = await orderService(userId, address, method);
    let responser = new Responser(201, 'order created successfully', order);
    responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal error', error));
  }
};

const getOrderById = async (req, res) => {
  try {
    let { id } = req.params;
    if (!isValidObjectId(id)) throw new ValidationError('Not a valid order id ' + id);
    let order = await Order.findById(id)
      .populate('products.productId', 'name thumbnail price discount')
      .lean();
    if (!order) throw new NotFoundError('no order found with this id ' + id);
    let responser = new Responser(200, 'order fetched successfully', order);
    responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal error', error));
  }
};

const getUserOrders = async (req, res) => {
  try {
    let { limit = 10, page = 1 } = req.query;
    let skip = (page - 1) * limit;
    let orders = await Order.find({ userId: req.userId })
      .populate('products.productId', 'name thumbnail price discount')
      .skip(skip)
      .limit(limit)
      .lean();
    let responser = new Responser(200, 'user orders fetched successfully', orders);
    responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal error', error));
  }
};

const getOrders = async (req, res) => {
  try {
    let { limit = 10, page = 1 } = req.query;
    let skip = (page - 1) * limit;
    let orders = await Order.find()
      .populate('products.productId', 'name thumbnail price discount')
      .skip(skip)
      .limit(limit)
      .lean();
    let responser = new Responser(200, 'orders fetched successfully', orders);
    responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal error', error));
  }
};
module.exports = { createOrder, getOrderById, getUserOrders, getOrders };
