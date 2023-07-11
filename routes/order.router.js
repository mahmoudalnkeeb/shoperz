const { createOrder } = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/authentication');
const authorize = require('../middlewares/authorization');
const orderRouter = require('express').Router();

orderRouter.post('/', authMiddleware, createOrder);

// get orders [dashboard]
orderRouter.get('/', authMiddleware, authorize('ADMIN'));

module.exports = orderRouter;
