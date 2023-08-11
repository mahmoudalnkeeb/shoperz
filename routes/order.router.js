const {
  createOrder,
  getOrders,
  getOrderById,
  getUserOrders,
  deleteOrder,
} = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/authentication');
const authorize = require('../middlewares/authorization');
const orderRouter = require('express').Router();

orderRouter.post('/', authMiddleware, createOrder);
orderRouter.get('/user', authMiddleware, getUserOrders);
// TODO: cancel order

// get orders [dashboard]
orderRouter.get('/', authMiddleware, authorize('ADMIN'), getOrders);
orderRouter.get('/:id', authMiddleware, authorize('ADMIN'), getOrderById);
orderRouter.delete('/:id', authMiddleware, authorize('ADMIN'), deleteOrder);

//TODO: managing orders status [dashboard]

module.exports = orderRouter;
