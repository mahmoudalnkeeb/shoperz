const { createOrder, getOrders, getOrderById, getUserOrders } = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/authentication');
const authorize = require('../middlewares/authorization');
const orderRouter = require('express').Router();

orderRouter.post('/', authMiddleware, createOrder);
orderRouter.get('/user', authMiddleware, getUserOrders);

// get orders [dashboard]
orderRouter.get('/', authMiddleware, authorize('ADMIN'), getOrders);
orderRouter.get('/:id', authMiddleware, authorize('ADMIN'), getOrderById);

module.exports = orderRouter;
